import {tmdbApiClient} from "helpers/tmdbApiClient";
import {ShowModel} from "models/showModel";
import {sendNotificationToUser} from "services/notifications";

export const checkForNewSeasons = async (): Promise<void> => {
    console.log("Запуск проверки новых сезонов...");
    try {
        const favoriteShows = await ShowModel.find({type: "tv"});
        const tmdbIds = Array.from(new Set(favoriteShows.map(s => s.tmdbId)));

        for (const tmdbId of tmdbIds) {
            let showName = "";
            let seasons = [];

            try {
                // 1) Получаем данные от TMDb
                const resp = await tmdbApiClient.get(`/tv/${tmdbId}?language=ru-RU`);
                showName = resp.data.name || resp.data.original_name;
                seasons = resp.data.seasons;
            } catch (err) {
                console.warn(`❌ Не удалось получить данные для TMDB ID: ${tmdbId}`, err);
                continue; // переход к следующему сериалу
            }

            if (!seasons.length) continue;

            const latest = seasons[seasons.length - 1];
            const latestNum = latest.season_number;
            const airDate = latest.air_date ? new Date(latest.air_date) : null;
            const today = new Date();

            // 2) Обновляем БД для всех устаревших записей
            await ShowModel.updateMany(
                {tmdbId, lastNotifiedSeason: {$lt: latestNum}},
                {$set: {lastNotifiedSeason: latestNum, isNotified: false}}
            );

            // 3) Если сезон вышел — собираем список тех, кто ещё не получил письмо
            if (airDate && airDate <= today) {
                const toNotify = await ShowModel.find({
                    tmdbId,
                    lastNotifiedSeason: latestNum,
                    isNotified: false,
                });

                console.log(`К уведомлению подготовлены ${toNotify.length} записей для ${showName} (сезон ${latestNum})`);

                const userNotifications: Record<string, string[]> = {};
                for (const show of toNotify) {
                    userNotifications[show.userId] ??= [];
                    userNotifications[show.userId].push(`${showName} (сезон ${latestNum})`);
                }

                // 4) Отправляем и отмечаем
                for (const [userId, shows] of Object.entries(userNotifications)) {
                    await sendNotificationToUser(userId, shows);
                    await ShowModel.updateMany(
                        {tmdbId, userId},
                        {$set: {isNotified: true}}
                    );
                }
            }
        }

        console.log("Проверка новых сезонов завершена!");
    } catch (err) {
        console.error("❌ Общая ошибка при проверке новых сезонов:", err);
    }
};
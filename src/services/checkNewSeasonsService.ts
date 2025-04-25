import {tmdbApiClient} from "helpers/tmdbApiClient";
import {ShowModel} from "models/showModel";
import {sendNotificationToUser} from "services/notifications";

export const checkForNewSeasons = async (): Promise<void> => {
    console.log("Запуск проверки новых сезонов...");

    try {
        const favoriteShows = await ShowModel.find({type: "tv"});
        const userNotifications: Record<string, string[]> = {};
        const today = new Date();

        for (const show of favoriteShows) {
            const {tmdbId, userId} = show;
            const lastNotifiedSeason = show.lastNotifiedSeason ?? 0;

            try {
                const response = await tmdbApiClient.get(`/tv/${tmdbId}?language=ru-RU`);
                const showName = response.data.name;

                if (!response.data?.seasons?.length) continue;

                const seasons = response.data.seasons;
                const latestSeason = seasons[seasons.length - 1];
                const latestSeasonNumber = latestSeason?.season_number ?? 0;
                const airDate = latestSeason?.air_date ? new Date(latestSeason.air_date) : null;

                if (latestSeasonNumber > lastNotifiedSeason) {
                    console.log(`Новый сезон анонсирован для ${showName}: сезон ${latestSeasonNumber}`);

                    await ShowModel.updateMany(
                        {tmdbId},
                        {$set: {lastNotifiedSeason: latestSeasonNumber, isNotified: false}}
                    );
                }

                if (airDate && airDate <= today && !show.isNotified && latestSeasonNumber > lastNotifiedSeason) {
                    console.log(`\u2705 Сезон ${latestSeasonNumber} сериала ${showName} уже вышел!`);

                    await ShowModel.updateMany(
                        {tmdbId},
                        {$set: {isNotified: true}}
                    );

                    if (!userNotifications[userId]) {
                        userNotifications[userId] = [];
                    }
                    //userNotifications[userId].push(showName);
                    userNotifications[userId].push(`${showName} (сезон ${latestSeasonNumber})`);
                }
            } catch (err) {
                console.error(`❌ Ошибка при запросе TMDb API для ID ${tmdbId}:`, err);
            }
        }

        for (const [userId, shows] of Object.entries(userNotifications)) {
            sendNotificationToUser(userId, shows);
        }
        console.log("Проверка новых сезонов завершена!");
    } catch (error) {
        console.error("❌ Общая ошибка при проверке новых сезонов:", error);
    }
};

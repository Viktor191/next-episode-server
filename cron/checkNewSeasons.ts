import cron from "node-cron";
import {tmdbApiClient} from "helpers/tmdbApiClient";
import {ShowModel} from "models/showModel";

// Заглушка: функция отправки уведомлений пользователю
const sendNotificationToUser = (userId: string, shows: string[]) => {
    console.log(`📩 Уведомление отправлено пользователю ${userId} о сериалах: ${shows.join(", ")}`);
};

// Функция для проверки новых сезонов
const checkForNewSeasons = async () => {
    console.log("🔍 Запуск проверки новых сезонов...");

    try {
        // Получаем все записи сериалов
        const favoriteShows = await ShowModel.find({type: "tv"});

        // Структура для хранения уведомлений по userId
        const userNotifications: Record<string, string[]> = {};

        const today = new Date();

        for (const show of favoriteShows) {
            const tmdbId = show.tmdbId;
            const userId = show.userId;
            const lastNotifiedSeason = show.lastNotifiedSeason ?? 0;

            try {
                const response = await tmdbApiClient.get(`/tv/${tmdbId}?language=ru-RU`);
                const showName = response.data.name;

                if (!response.data?.seasons?.length) continue;

                const seasons = response.data.seasons;
                const latestSeason = seasons[seasons.length - 1];
                const latestSeasonNumber = latestSeason?.season_number ?? 0;
                const airDate = latestSeason?.air_date ? new Date(latestSeason.air_date) : null;

                // Обновляем lastNotifiedSeason, если появился новый сезон
                if (latestSeasonNumber > lastNotifiedSeason) {
                    console.log(`📣 Новый сезон анонсирован для ${showName}: сезон ${latestSeasonNumber}`);

                    await ShowModel.updateMany(
                        {tmdbId},
                        {$set: {lastNotifiedSeason: latestSeasonNumber, isNotified: false}}
                    );
                }

                // Уведомляем о выходе сезона, если дата выхода наступила и уведомление не было отправлено
                if (airDate && airDate <= today && !show.isNotified && latestSeasonNumber > lastNotifiedSeason) {
                    console.log(`✅ Сезон ${latestSeasonNumber} сериала ${showName} уже вышел!`);

                    await ShowModel.updateMany(
                        {tmdbId},
                        {$set: {isNotified: true}}
                    );

                    // Добавляем в список уведомлений для конкретного пользователя
                    if (!userNotifications[userId]) {
                        userNotifications[userId] = [];
                    }
                    userNotifications[userId].push(showName);
                }
            } catch (err) {
                console.error(`❌ Ошибка при запросе TMDb API для ID ${tmdbId}:`, err);
            }
        }

        // Отправка уведомлений (заглушка)
        for (const [userId, shows] of Object.entries(userNotifications)) {
            sendNotificationToUser(userId, shows);
        }
        console.log("🔍 Проверка новых сезонов завершена!");
    } catch (error) {
        console.error("❌ Общая ошибка при проверке новых сезонов:", error);
    }
};

// CRON-задача: проверка каждый день в 8 утра
cron.schedule("0 8 * * *", () => { // для тестов "*/1 * * * *" раз в минуту, в восемь утра "0 8 * * *"
    checkForNewSeasons();
});

console.log("🕒 CRON-задача для проверки новых сезонов запущена!");

// для тестов "*/1 * * * *" раз в минуту, а в восемь утра "0 8 * * *"
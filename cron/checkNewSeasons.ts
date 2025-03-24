import cron from "node-cron";
import {tmdbApiClient} from "helpers/tmdbApiClient"; // Используем твой настроенный клиент TMDb API
import {ShowModel} from "models/showModel";
import * as console from "node:console"; // Модель сериалов в MongoDB

// Функция для проверки новых сезонов
const checkForNewSeasons = async () => {
    console.log("🔍 Запуск проверки новых сезонов...");


    try {
        // Получаем ВСЕ сериалы, которые есть в избранном и ещё не уведомлены
        const favoriteShows = await ShowModel.find({type: "tv", isNotified: false});
        console.log(favoriteShows);
        for (const show of favoriteShows) {
            const tmdbId = show.tmdbId;

            try {
                // Делаем запрос к TMDb API, чтобы получить список сезонов
                const response = await tmdbApiClient.get(`/tv/${tmdbId}?language=ru-RU`);
                console.log(`Полученные данные от TMDb для сериала с ID ${tmdbId}:`);
                // console.log(response.data);
                if (!response.data?.seasons?.length) continue; // Если нет данных о сезонах, пропускаем

                // Последний сезон
                const lastSeason = response.data.seasons[response.data.seasons.length - 1];
                console.log(`Последний сезон для ${response.data.name}: ${lastSeason.season_number}`);
                // console.log(response.data)
                // Определяем переменные today и airDate
                const today = new Date();
                const airDate = new Date(lastSeason.air_date);
                // console.log(`Сегодня: ${today}, дата выхода: ${airDate}`);

                // Проверяем, не наступила ли его дата выхода
                if (lastSeason.air_date && airDate <= today) {
                    console.log(`🚀 Новый сезон для ${response.data.name}: ${lastSeason.season_number}!!!`);
                    await ShowModel.updateOne({tmdbId}, {$set: {isNotified: true}});
                }
            } catch (err) {
                console.error(`❌ Ошибка при запросе TMDb API для ID ${tmdbId}:`, err);
            }
        }
    } catch (error) {
        console.error("❌ Общая ошибка при проверке новых сезонов:", error);
    }
};

// CRON-задача: проверка каждый день в 8 утра
cron.schedule("0 8 * * *", () => { // для тестов "*/1 * * * *" раз в минуту, а в восемь утра "0 8 * * *"
    checkForNewSeasons();
});

console.log("🕒 CRON-задача для проверки новых сезонов запущена!");
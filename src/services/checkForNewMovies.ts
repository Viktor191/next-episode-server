import {tmdbApiClient} from "helpers/tmdbApiClient";
import {ShowModel} from "models/showModel";
import {sendNotificationToUser} from "services/notifications";

export const checkForNewMovies = async (): Promise<void> => {
    console.log("Запуск проверки выхода новых фильмов...");

    try {
        // Получаем все избранные фильмы, фильтруем type="movie" и только те, по которым не отправляли уведомление
        const favoriteMovies = await ShowModel.find({type: "movie", isNotified: false});

        const today = new Date().toISOString().split("T")[0]; // строка YYYY-MM-DD
        const userNotifications: Record<string, string[]> = {};

        for (const show of favoriteMovies) {
            const {tmdbId, userId} = show;
            try {
                // Запрашиваем у TMDb данные фильма
                const response = await tmdbApiClient.get(`/movie/${tmdbId}?language=ru-RU`);
                const title = response.data.title;
                const releaseDate = response.data.release_date; // формат YYYY-MM-DD

                // Если фильм выходит сегодня — готовим уведомление
                if (releaseDate === today) {
                    console.log(`✅ Фильм "${title}" выходит сегодня!`);
                    userNotifications[userId] ??= [];
                    userNotifications[userId].push(`"${title}"`);
                }
            } catch (err) {
                console.error(`❌ Ошибка при запросе TMDb для фильма ID ${show.tmdbId}:`, err);
            }
        }

        // Отправляем письма и помечаем в базе как уведомлённые
        for (const [userId, titles] of Object.entries(userNotifications)) {
            try {
                await sendNotificationToUser(userId, titles);
                // Помечаем все релизы этого пользователя как отправленные
                await ShowModel.updateMany(
                    {userId, type: "movie", isNotified: false},
                    {$set: {isNotified: true}}
                );
            } catch (err) {
                console.error(`❌ Ошибка при отправке уведомления пользователю ${userId}:`, err);
            }
        }

        console.log("Проверка новых фильмов завершена!");
    } catch (err) {
        console.error("❌ Общая ошибка при проверке новых фильмов:", err);
    }
};

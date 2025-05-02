import {tmdbApiClient} from "helpers/tmdbApiClient";
import {ShowModel} from "models/showModel";
import {sendNotificationToUser} from "services/notifications";
import {debug, info, error as logError} from "helpers/logger";

export const checkForNewMovies = async (): Promise<void> => {
    info("Запуск проверки выхода новых фильмов...");

    try {
        const favoriteMovies = await ShowModel.find({type: "movie", isNotified: false});
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const userNotifications: Record<string, string[]> = {};

        for (const show of favoriteMovies) {
            const {tmdbId, userId} = show;
            try {
                const response = await tmdbApiClient.get(`/movie/${tmdbId}?language=ru-RU`);
                const title = response.data.title as string;
                const releaseDate = response.data.release_date as string; // YYYY-MM-DD

                if (releaseDate === today) {
                    debug(`Фильм "${title}" выходит сегодня!`);
                    userNotifications[userId] ??= [];
                    userNotifications[userId].push(`"${title}"`);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    logError(`Ошибка при запросе TMDb для фильма ID ${tmdbId}:`, err.message);
                } else {
                    logError(`Неизвестная ошибка при запросе TMDb для фильма ID ${tmdbId}:`, err);
                }
            }
        }

        for (const [userId, titles] of Object.entries(userNotifications)) {
            try {
                await sendNotificationToUser(userId, titles);
                await ShowModel.updateMany(
                    {userId, type: "movie", isNotified: false},
                    {$set: {isNotified: true}}
                );
            } catch (err: unknown) {
                if (err instanceof Error) {
                    logError(`Ошибка при отправке уведомления пользователю ${userId}:`, err.message);
                } else {
                    logError(`Неизвестная ошибка при отправке уведомления пользователю ${userId}:`, err);
                }
            }
        }

        info("Проверка новых фильмов завершена!");
    } catch (err: unknown) {
        if (err instanceof Error) {
            logError("Общая ошибка при проверке новых фильмов:", err.message);
        } else {
            logError("Неизвестная общая ошибка при проверке новых фильмов:", err);
        }
    }
};
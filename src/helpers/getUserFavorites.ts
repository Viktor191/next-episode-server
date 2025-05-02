import {ShowModel} from "models/showModel";
import {fetchMovieByDbID, fetchTvByDbID} from "helpers/tmdbSearchHelp";
import {error as logError} from "helpers/logger";

export const getUserFavorites = async (userId: string): Promise<ReturnType<typeof fetchMovieByDbID>[]> => {
    if (!userId) {
        throw new Error("Необходим идентификатор пользователя");
    }

    const favorites = await ShowModel.find({userId});

    const results = await Promise.all(
        favorites.map(async (favorite) => {
            try {
                if (favorite.type === "movie") {
                    return await fetchMovieByDbID(favorite.tmdbId);
                } else {
                    return await fetchTvByDbID(favorite.tmdbId);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    logError(
                        `Ошибка при получении данных для ${favorite.type} (ID: ${favorite.tmdbId}):`,
                        err.message
                    );
                } else {
                    logError(
                        `Неизвестная ошибка при получении данных для ${favorite.type} (ID: ${favorite.tmdbId}):`,
                        err
                    );
                }
                return null;
            }
        })
    );

    // Фильтруем возможные null
    return results.filter((item): item is NonNullable<typeof item> => Boolean(item));
};
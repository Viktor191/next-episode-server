import {ShowModel} from "models/showModel";
import {fetchMovieByDbID, fetchTvByDbID} from "helpers/tmdbSearchHelp";

export const getUserFavorites = async (userId: string) => {
    if (!userId) throw new Error("Необходим идентификатор пользователя");

    const favorites = await ShowModel.find({userId});

    const results = await Promise.all(
        favorites.map(async (favorite) => {
            try {
                if (favorite.type === "movie") {
                    return await fetchMovieByDbID(favorite.tmdbId);
                } else if (favorite.type === "tv") {
                    return await fetchTvByDbID(favorite.tmdbId);
                }
            } catch (error) {
                console.error(`Ошибка при получении данных для ${favorite.type} (ID: ${favorite.tmdbId})`, error);
                return null;
            }
        })
    );

    return results.filter(Boolean);
};
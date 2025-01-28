import {Request, Response} from "express";
import {ShowModel} from "models/showModel";
import {fetchMovieByDbID, fetchTvByDbID} from "helpers/tmdbSearchHelp";

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(400).json({error: "Необходим идентификатор пользователя"});
            return;
        }

        const favorites = await ShowModel.find({userId});

        if (!favorites || favorites.length === 0) {
            res.status(404).json({error: "Избранное пусто"});
            return;
        }

        const results = await Promise.all(
            favorites.map(async (favorite) => {
                if (favorite.type === "movie") {
                    return await fetchMovieByDbID(favorite.tmdbId);
                } else if (favorite.type === "tv") {
                    return await fetchTvByDbID(favorite.tmdbId);
                }
                return null;
            })
        );

        const filteredResults = results.filter((result) => result !== null);

        res.status(200).json(filteredResults);
    } catch (error: any) {
        console.error("Ошибка при получении деталей избранного:", error.message);
        res.status(500).json({error: "Ошибка сервера"});
    }
};
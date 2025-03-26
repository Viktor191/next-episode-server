import {Request, Response} from "express";
import {getUserFavorites} from "helpers/getUserFavorites";
import {AuthenticatedRequest} from "types/request";

export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({error: "Требуется идентификатор пользователя userId"});
            return;
        }
        const results = await getUserFavorites(userId);
        // console.log("Избранное:", results);
        res.status(200).json(results);
    } catch (error: any) {
        console.error("Ошибка при получении избранного:", error.message);
        res.status(500).json({error: "Ошибка сервера"});
    }
};


/*
import {Request, Response} from "express";
import {ShowModel} from "models/showModel";
import {fetchMovieByDbID, fetchTvByDbID} from "helpers/tmdbSearchHelp";
import {AuthenticatedRequest} from "types/request";

export const getFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(400).json({error: "Необходим идентификатор пользователя"});
            return;
        }

        const favorites = await ShowModel.find({userId});

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
*/
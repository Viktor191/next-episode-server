import {Request, Response} from "express";
import {ShowModel} from "models/showModel";
import {fetchMovieByDbID, fetchTvByDbID} from "helpers/tmdbSearchHelp";

export const addToFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const {tmdbId, type} = req.body;
        const userId = req.user?.userId;

        if (!tmdbId || !type) {
            res.status(400).json({error: "Пожалуйста, укажите tmdbId и тип (tv или movie)"});
            return;
        }

        const existingShow = await ShowModel.findOne({tmdbId, type});
        if (existingShow) {
            res.status(400).json({error: "Шоу уже есть в избранном"});
            return;
        }

        const newFavorite = new ShowModel({
            tmdbId,
            type,
            userId,
            isNotified: false,
        });

        await newFavorite.save();
        res.status(201).json({message: "Успешно добавлено в избранное"});
    } catch (error: any) {
        console.error("Ошибка при добавлении в избранное:", error.message);
        res.status(500).json({error: "Ошибка сервера"});
    }
};

export const getFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(400).json({message: "Необходим идентификатор пользователя"});
            return;
        }

        const favorites = await ShowModel.find({userId});

        res.status(200).json(favorites);
    } catch (error) {
        console.error("Ошибка получения избранного:", error);
        res.status(500).json({message: "Ошибка сервера"});
    }
};

export const deleteFromFavorites = async (req: Request, res: Response): Promise<void> => {
    try {
        const {tmdbId, type} = req.body;
        const userId = req.user?.userId;

        if (!tmdbId || !type) {
            res.status(400).json({error: "Пожалуйста, укажите tmdbId и тип (tv или movie)"});
            return;
        }

        await ShowModel.deleteOne({tmdbId, type, userId});
        res.status(200).json({message: "Успешно удалено из избранного"});
    } catch (error: any) {
        console.error("Ошибка при удалении из избранного:", error.message);
        res.status(500).json({error: "Ошибка сервера"});
    }
}

export const getFavoritesDetails = async (req: Request, res: Response): Promise<void> => {
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
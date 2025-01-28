import {Request, Response} from "express";
import {tmdbApiClient} from "helpers/tmdbApiClient";
import {unwrapObject} from "helpers/unwrapObject";
import {ShowModel} from "models/showModel";
import {AuthenticatedRequest} from "types/request";

export const getMovieByName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const name = req.params.name;

        if (!name) {
            res.status(400).json({error: 'Введите название фильма'});
            return;
        }

        const response = await tmdbApiClient.get('/search/movie', {
            params: {
                query: name,
                language: 'en-US',// "ru-RU" для русского языка
            },
        });

        const results = response.data.results;

        if (!results || results.length === 0) {
            res.status(404).json({error: 'Ничего не найдено'});
            return;
        }

        const simplifiedResults = results.map((data: any) => ({
            id: data.id,
            overview: data.overview,
            vote_average: data.vote_average,
            title: data.title,
            original_title: data.original_title,
            release_date: data.release_date,
        }));

        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error('Ошибка при поиске фильма:', error.message);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

export const getTvByName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const name = req.params.name;

        if (!name) {
            res.status(400).json({error: 'Введите название сериала'});
            return;
        }

        const response = await tmdbApiClient.get("/search/tv", {
            params: {
                query: name,
                language: "en-US", //"ru-RU" для русского языка
            },
        });

        const results = response.data.results;

        if (!results || results.length === 0) {
            res.status(404).json({error: 'Ничего не найдено'});
            return;
        }

        const simplifiedResults = results.map((data: any) => ({
            id: data.id,
            overview: data.overview,
            vote_average: data.vote_average,
            title: data.name,
            original_title: data.original_name,
            release_date: data.first_air_date,
        }));

        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error('Ошибка при поиске сериала:', error.message);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

export const getMovieByDbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const dbID = req.params.dbID;

        if (!dbID) {
            res.status(400).json({message: "TMDB ID is required"});
            return;
        }

        try {
            const response = await tmdbApiClient.get(`/movie/${dbID}`);
            const movieData = response.data;

            if (movieData) {
                const simplifiedResult = {
                    id: movieData.id,
                    overview: movieData.overview,
                    vote_average: movieData.vote_average,
                    title: movieData.title,
                    original_title: movieData.original_title,
                    release_date: movieData.release_date,
                };

                res.status(200).json(simplifiedResult);
                return;
            }
        } catch (error: any) {
            console.error(`Error fetching movie with ID ${dbID}:`, error.message);
        }

        res.status(404).json({message: "No results found for the given TMDB ID"});
    } catch (error: any) {
        console.error("Error fetching details by TMDB ID:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getTvByDbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const dbID = req.params.dbID;

        if (!dbID) {
            res.status(400).json({message: "TMDB ID is required"});
            return;
        }

        try {
            const response = await tmdbApiClient.get(`/tv/${dbID}`);
            const tvData = response.data;

            if (tvData) {
                const simplifiedResult = {
                    id: tvData.id,
                    overview: tvData.overview,
                    vote_average: tvData.vote_average,
                    title: tvData.name,
                    original_title: tvData.original_name,
                    release_date: tvData.first_air_date,
                };

                res.status(200).json(simplifiedResult);
                return;
            }
        } catch (error: any) {
            console.error(`Error fetching TV show with ID ${dbID}:`, error.message);
        }

        res.status(404).json({message: "No results found for the given TMDB ID"});
    } catch (error: any) {
        console.error("Error fetching details by TMDB ID:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const getMovieByImdbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const imdbID = req.params.imdbID;

        if (!imdbID) {
            res.status(400).json({message: "IMDb ID is required"});
            return;
        }

        const response = await tmdbApiClient.get(`/find/${imdbID}`, {
            params: {external_source: "imdb_id"},
        });

        const apiResponse = response.data;

        const firstResult = unwrapObject(apiResponse);

        if (!firstResult) {
            res.status(404).json({message: "No results found for the given IMDb ID"});
            return;
        }

        const simplifiedResult = {
            id: firstResult.id,
            overview: firstResult.overview,
            vote_average: firstResult.vote_average,
            title: firstResult.title || firstResult.name,
            original_title: firstResult.original_title || firstResult.original_name,
            release_date: firstResult.release_date || firstResult.first_air_date,
        };

        res.status(200).json(simplifiedResult);
    } catch (error: any) {
        console.error("Error fetching movie by IMDb ID:", error.message);
        res.status(500).json({message: "Internal server error"});
    }
};

export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {type} = req.body;
        const userId = req.user?.userId;
        const {tmdbId} = req.params;

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

export const deleteFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {type} = req.body;
        const userId = req.user?.userId;
        const {tmdbId} = req.params;

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
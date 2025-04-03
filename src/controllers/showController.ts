import {Response} from "express";
import {tmdbApiClient} from "helpers/tmdbApiClient";
import {unwrapObject} from "helpers/unwrapObject";
import {ShowModel} from "models/showModel";
import {AuthenticatedRequest} from "types/request";
import * as console from "node:console";
import {formatShowData} from "helpers/formatShow";

export const getMovieByName = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const name = req.params.name;
        if (!name) {
            res.status(400).json({error: 'Введите название фильма'});
            return;
        }

        const response = await tmdbApiClient.get('/search/movie', {
            params: {query: name, language: 'ru-RU'},
        });

        const results = response.data.results;
        // console.log(results); // Для отладки
        if (!results || results.length === 0) {
            res.status(200).json([]);
            return;
        }

        const simplifiedResults = results.map((data: any) => ({
            ...formatShowData(data),
            media_type: "movie",
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
            params: {query: name, language: "ru-RU"},
        });

        const results = response.data.results;
        if (!results || results.length === 0) {
            res.status(200).json([]);
            return;
        }

        const simplifiedResults = results.map((data: any) => ({
            ...formatShowData(data),
            media_type: "tv",
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
            res.status(400).json({message: "Пожалуйста, укажите TMDB ID"});
            return;
        }

        const response = await tmdbApiClient.get(`/movie/${dbID}`, {
            params: {language: "ru-RU"},
        });

        const movieData = response.data;
        if (movieData) {
            const simplifiedResult = {
                ...formatShowData(movieData),
                media_type: "movie", // Добавлено поле media_type
            };
            res.status(200).json(simplifiedResult);
            return;
        }

        res.status(404).json({message: "❌ Фильм с указанным TMDB ID не найден"});
    } catch (error: any) {
        console.error(`Ошибка при получении фильма с ID ${req.params.dbID}:`, error.message);
        res.status(500).json({message: "❌ Внутренняя ошибка сервера при получении фильма"});
    }
};

export const getTvByDbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const dbID = req.params.dbID;

        if (!dbID) {
            res.status(400).json({message: "Пожалуйста, укажите TMDB ID"});
            return;
        }

        const response = await tmdbApiClient.get(`/tv/${dbID}`, {
            params: {language: "ru-RU"},
        });

        const tvData = response.data;
        // console.log(tvData); // Попробовать без simplifiedResult и выводить каждый сезон отдельной карточкой
        if (tvData) {
            const simplifiedResult = {
                ...formatShowData(tvData),
                media_type: "tv", // Добавлено поле media_type
            };
            res.status(200).json(simplifiedResult);
            return;
        }

        res.status(404).json({message: "❌ Сериал с указанным TMDB ID не найден"});
    } catch (error: any) {
        console.error(`Ошибка при получении сериала с ID ${req.params.dbID}:`, error.message);
        res.status(500).json({message: "❌ Внутренняя ошибка сервера при получении сериала"});
    }
};

export const getMovieByImdbID = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const imdbID = req.params.imdbID;

        if (!imdbID) {
            res.status(400).json({message: "Требуется указать IMDb ID"});
            return;
        }

        const response = await tmdbApiClient.get(`/find/${imdbID}`, {
            params: {
                external_source: "imdb_id",
                language: "ru-RU",
            },
        });

        const firstResult = unwrapObject(response.data);
        if (!firstResult) {
            res.status(404).json({message: "По указанному IMDb ID ничего не найдено"});
            return;
        }

        const simplifiedResult = formatShowData(firstResult);
        res.status(200).json(simplifiedResult);
    } catch (error: any) {
        console.error("Ошибка при получении данных по IMDb ID:", error.message);
        res.status(500).json({message: "Внутренняя ошибка сервера"});
    }
};

export const addToFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const {type} = req.body;
        const userId = req.user?.userId;
        const {dbID} = req.params;
        // console.log(`Получен запрос на добавление: dbID=${req.params.dbID}, type=${req.body.type}`);
        if (!dbID || !type) {
            res.status(400).json({error: "Пожалуйста, укажите id и тип (tv или movie)"});
            return;
        }

        let lastNotifiedSeason = 0;

        if (type === "tv") {
            try {
                const response = await tmdbApiClient.get(`/tv/${dbID}`, {
                    params: {language: "ru-RU"},
                });
                const seasons = response.data.seasons;
                const lastSeason = seasons[seasons.length - 1];
                lastNotifiedSeason = lastSeason?.season_number || 0;
            } catch (error: any) {
                console.error("Ошибка при получении данных о сезонах:", error.message);
            }
        }

        const existingShow = await ShowModel.findOne({tmdbId: dbID, type, userId});
        if (existingShow) {
            res.status(400).json({error: "Уже есть в избранном"});
            return;
        }

        const newFavorite = new ShowModel({
            tmdbId: dbID,
            type,
            userId,
            isNotified: false,
            lastNotifiedSeason,
        });

        await newFavorite.save();
        console.log(`Добавлено в избранное: ${dbID} (${type})`);
        res.status(201).json({message: "Успешно добавлено в избранное"});
    } catch (error: any) {
        console.error("Ошибка при добавлении в избранное:", error.message);
        res.status(500).json({error: "Ошибка сервера"});
    }
};

export const deleteFromFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const {id} = req.params;

        if (!id) {
            res.status(400).json({error: `"Пожалуйста, укажите id" ${userId} ${id}`});
            return;
        }

        await ShowModel.deleteOne({tmdbId: id, userId});
        res.status(200).json({message: "Успешно удалено из избранного"});
    } catch (error: any) {
        console.error("Ошибка при удалении из избранного:", error.message);
        res.status(500).json({error: "Ошибка сервера"});
    }
};

export const getUpcomingMovies = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;

        const response = await tmdbApiClient.get("/movie/upcoming", {
            params: {
                language: "ru-RU",
                page,
            },
        });

        const results = response.data.results;
        if (!results || results.length === 0) {
            res.status(404).json({error: "❌ Предстоящие фильмы не найдены"});
            return;
        }

        const simplifiedResults = results.map(formatShowData);
        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error("Ошибка при получении предстоящих фильмов:", error.message);
        res.status(500).json({error: "❌ Ошибка сервера при получении предстоящих фильмов"});
    }
};
import {Request, Response} from "express";
import axios from "axios";
import dotenv from "dotenv";
import {processSearchResults} from "controllers/fetchController";

dotenv.config();

const TMDB_API_URL = process.env.TMDB_API_URL;

export const getMovieByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const {query} = req.query;

        if (!query) {
            res.status(400).json({error: 'Введите запрос'});
            return;
        }

        const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
            params: {
                query,
                language: 'en-US',
            },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
            },
        });

        const results = response.data.results;

        if (!results || results.length === 0) {
            res.status(404).json({error: 'Ничего не найдено'});
            return;
        }

        const simplifiedResults = processSearchResults(results);

        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error('Ошибка при поиске фильма:', error.message);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};
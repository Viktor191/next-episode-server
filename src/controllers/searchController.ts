import {Request, Response} from "express";
import axios from "axios";

const TMDB_API_URL = process.env.TMDB_API_URL;

export const searchMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const {query} = req.query;

        if (!query) {
            res.status(400).json({error: 'Введите запрос'});
            return;
        }
        const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
            params: {
                query,
                language: 'en-US', // 'ru-RU' - для русского языка 'en-US' - для английского
            },
            headers: {
                Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
            },
        });
        console.log(response.data);

        res.status(200).json(response.data)
    } catch (error: any) {
        console.error('Ошибка при поиске фильма:', error.message);

        res.status(500).json({error: 'Ошибка сервера'});
    }
}
import {Request, Response} from "express";
import axios from "axios";

const TMDB_API_URL = process.env.TMDB_API_URL;

type SelectedMovieResult = {
    id: number;
    name: string;
    overview: string;
    first_air_date: string | null;
    vote_average: number;
};
// поиск фильма по названию или ключевому слову
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
        const results = response.data.results;

        if (!results || results.length === 0) {
            res.status(404).json({error: 'Ничего не найдено'});
            return;
        }

        const simplifiedResults: SelectedMovieResult[] = results.map((result: any) => ({
            id: result.id,
            name: result.title || result.original_title,
            overview: result.overview,
            first_air_date: result.release_date || null,
            vote_average: result.vote_average,
        }));

        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error('Ошибка при поиске фильма:', error.message);

        res.status(500).json({error: 'Ошибка сервера'});
    }
}
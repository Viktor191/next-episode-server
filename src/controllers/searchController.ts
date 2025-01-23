import {Request, Response} from "express";
import axios from "axios";
import dotenv from "dotenv";
import {MovieResult, TVResult} from "types/common";

dotenv.config();

const TMDB_API_URL = process.env.TMDB_API_URL;

export const getMovieByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.name; // Извлекаем параметр "name" из URL

        if (!name) {
            res.status(400).json({error: 'Введите название фильма'});
            return;
        }

        const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
            params: {
                query: name,
                language: 'en-US', // Укажите "ru-RU" для русского языка
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

        const simplifiedResults = results.map((data: MovieResult) => ({
            id: data.id,
            overview: data.overview,
            vote_average: data.vote_average,
            title: data.title,// Дублируют названия, исправить
            original_title: data.original_title,// Дублируют названия, исправить
            release_date: data.release_date,
        }));

        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error('Ошибка при поиске фильма:', error.message);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};

export const getTvByName = async (req: Request, res: Response): Promise<void> => {
    try {
        const name = req.params.name;

        if (!name) {
            res.status(400).json({error: 'Введите название сериала'});
            return;
        }

        const response = await axios.get(`${TMDB_API_URL}/search/tv`, {
            params: {
                query: name,
                language: 'en-US', // Укажите "ru-RU" для русского языка
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

        const simplifiedResults = results.map((data: TVResult) => ({
            id: data.id,
            overview: data.overview,
            vote_average: data.vote_average,
            title: data.name,// Дублируют названия, исправить
            original_title: data.original_name,// Дублируют названия, исправить
            release_date: data.first_air_date,
        }));

        res.status(200).json(simplifiedResults);
    } catch (error: any) {
        console.error('Ошибка при поиске сериала:', error.message);
        res.status(500).json({error: 'Ошибка сервера'});
    }
};
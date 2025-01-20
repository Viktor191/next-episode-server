import axios from "axios";
import dotenv from "dotenv";
import {FindByIDResponse, TVResult} from "models/showModel";

dotenv.config();

type Sourse = 'imdb_id' | 'youtube_id';

const TMDB_API_URL = process.env.TMDB_API_URL;

// вспомогательная функция для поиска фильма или сериала по IMDb ID используется в контроллере searchController.ts
export const findByID = async (externalId: string, sourse: Sourse = 'imdb_id') => {
    const {data} = await axios.get<FindByIDResponse>(`${TMDB_API_URL}/find/${externalId}?external_source=${sourse}`, {
        headers: {Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`}
    })
    return data;
}
// вспомогательная функция для поиска фильма по TMDB ID используется в контроллере searshDBIDController.ts
export const findByDbID = async (externalId: string) => {
    const {data} = await axios.get(`${TMDB_API_URL}/movie/${externalId}`, {
        headers: {Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`}
    })
    return data;
}

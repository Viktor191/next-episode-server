import axios from "axios";
import dotenv from "dotenv";
import {FindByIDResponse} from "models/showModel";

dotenv.config();

type Sourse = 'imdb_id' | 'youtube_id';


const TMDB_API_URL = process.env.TMDB_API_URL;

export const findByID = async (externalId: string, sourse: Sourse = 'imdb_id') => {
    const {data} = await axios.get<FindByIDResponse>(`${TMDB_API_URL}/find/${externalId}?external_source=${sourse}`, {
        headers: {Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`}
    })
    return data;
}

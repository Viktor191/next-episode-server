import axios from "axios";
import dotenv from "dotenv";
import {FindByIDResponse, MovieResult, TVResult} from "types/common";
import {FilteredResult} from "types/common";

dotenv.config();

const TMDB_API_URL = process.env.TMDB_API_URL;
const TMDB_BEARER_TOKEN = process.env.TMDB_BEARER_TOKEN || "your_token";

export const fetchFromTMDB = async <T>(
    endpoint: string,
    params?: Record<string, string | number>
): Promise<T> => {
    try {
        const {data} = await axios.get<T>(`${TMDB_API_URL}${endpoint}`, {
            params,
            headers: {
                Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
            },
        });
        return data;
    } catch (error: any) {
        console.error(`Ошибка при запросе к TMDB API (${endpoint}):`, error.message);
        throw new Error("Ошибка при запросе к TMDB API");
    }
};

export const fetchFromTMDBID = async <T>(
    id: string,
    type: "movie" | "tv",
    params?: Record<string, string | number>
): Promise<T> => {
    try {
        const endpoint = `/${type}/${id}`;
        const {data} = await axios.get<T>(`${TMDB_API_URL}${endpoint}`, {
            params,
            headers: {
                Authorization: `Bearer ${TMDB_BEARER_TOKEN}`,
            },
        });
        return data;
    } catch (error: any) {
        console.error(`Ошибка при запросе к TMDB API (${id}, ${type}):`, error.message);
        throw new Error("Ошибка при запросе к TMDB API");
    }
};

export const processApiResponse = (apiResponse: FindByIDResponse, param?: string) => {

    if (apiResponse.tv_results && apiResponse.tv_results.length > 0) {
        const tvResult: TVResult = apiResponse.tv_results[0];
        return {
            id: tvResult.id,
            overview: tvResult.overview,
            vote_average: tvResult.vote_average,
            name: tvResult.name,
            original_name: tvResult.original_name,
            first_air_date: tvResult.first_air_date,
        };
    }

    if (apiResponse.movie_results && apiResponse.movie_results.length > 0) {
        const movieResult: MovieResult = apiResponse.movie_results[0];
        return {
            id: movieResult.id,
            overview: movieResult.overview,
            vote_average: movieResult.vote_average,
            title: movieResult.title,
            original_title: movieResult.original_title,
            release_date: movieResult.release_date,
        };
    }

    return null;
};

export const filterDbIDResponse = (
    dbResponse: MovieResult | TVResult
): FilteredResult | null => {
    if ("title" in dbResponse && "release_date" in dbResponse) {
        return {
            id: dbResponse.id,
            overview: dbResponse.overview,
            vote_average: dbResponse.vote_average,
            title: dbResponse.title,
            original_title: dbResponse.original_title,
            release_date: dbResponse.release_date,
        };
    }

    if ("name" in dbResponse && "first_air_date" in dbResponse) {
        return {
            id: dbResponse.id,
            overview: dbResponse.overview,
            vote_average: dbResponse.vote_average,
            name: dbResponse.name,
            original_name: dbResponse.original_name,
            first_air_date: dbResponse.first_air_date,
        };
    }

    return null;
};

export const processSearchResults = (
    searchResults: (MovieResult | TVResult)[]
): FilteredResult[] => {
    return searchResults
        .map((result) => filterDbIDResponse(result))
        .filter((filteredResult): filteredResult is FilteredResult => filteredResult !== null);
};
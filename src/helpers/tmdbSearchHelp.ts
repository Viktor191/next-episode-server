import {tmdbApiClient} from "helpers/tmdbApiClient";

export const fetchMovieByDbID = async (dbID: string): Promise<any> => {
    try {
        const response = await tmdbApiClient.get(`/movie/${dbID}`, {
            params: {language: 'ru-RU'},
        });
        const movieData = response.data;
        return {
            id: movieData.id,
            overview: movieData.overview,
            vote_average: movieData.vote_average,
            title: movieData.title,
            original_title: movieData.original_title,
            release_date: movieData.release_date,
            poster_path: movieData.poster_path,
            media_type: "movie"
        };
    } catch (error: any) {
        console.error(`Error fetching movie with ID ${dbID}:`, error.message);
        return null;
    }
};

export const fetchTvByDbID = async (dbID: string): Promise<any> => {
    try {
        const response = await tmdbApiClient.get(`/tv/${dbID}`, {
            params: {language: 'ru-RU'},
        });
        const tvData = response.data;
        const seasons = tvData.seasons;
        const lastSeason = seasons[seasons.length - 1];
        const lastSeasonNumber = lastSeason?.season_number;

        return {
            id: tvData.id,
            overview: tvData.overview,
            vote_average: tvData.vote_average,
            title: tvData.name,
            original_title: tvData.original_name,
            release_date: tvData.first_air_date,
            poster_path: tvData.poster_path,
            media_type: "tv",
            lastNotifiedSeason: lastSeasonNumber,
        };
    } catch (error: any) {
        console.error(`Error fetching TV show with ID ${dbID}:`, error.message);
        return null;
    }
};
import {tmdbApiClient} from "helpers/tmdbApiClient";

export const fetchMovieByDbID = async (dbID: string): Promise<any> => {
    try {
        const response = await tmdbApiClient.get(`/movie/${dbID}`);
        const movieData = response.data;
        // console.log("movieData:", movieData);
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
        const response = await tmdbApiClient.get(`/tv/${dbID}`);
        const tvData = response.data;

        return {
            id: tvData.id,
            overview: tvData.overview,
            vote_average: tvData.vote_average,
            title: tvData.name,
            original_title: tvData.original_name,
            release_date: tvData.first_air_date,
            poster_path: tvData.poster_path,
            media_type: "tv"
        };
    } catch (error: any) {
        console.error(`Error fetching TV show with ID ${dbID}:`, error.message);
        return null;
    }
};
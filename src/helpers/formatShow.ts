export interface SimplifiedShow {
    id: number;
    overview: string;
    vote_average: number;
    title: string;
    original_title: string;
    release_date: string;
    poster_path?: string | undefined;
    media_type?: "movie" | "tv";
}

export const formatShowData = (data: any): SimplifiedShow => ({
    id: data.id,
    overview: data.overview,
    vote_average: data.vote_average,
    title: data.title || data.name,
    original_title: data.original_title || data.original_name,
    release_date: data.release_date || data.first_air_date,
    poster_path: data.poster_path,
    media_type: data.media_type,
});
export interface FindByIDResponse {
    movie_results: MovieResult[];
    person_results: any[];
    tv_results: TVResult[];
    tv_episode_results: any[];
    tv_season_results: any[];
}

export interface TVResult {
    backdrop_path: string | null;
    id: number;
    name: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    media_type: string;
    adult: boolean;
    original_language: string;
    genre_ids: number[];
    popularity: number;
    first_air_date: string;
    vote_average: number;
    vote_count: number;
    origin_country: string[];
}

export type SelectedTVResult = Pick<TVResult, 'id' | 'name' | 'overview' | 'first_air_date' | 'vote_average'>;

export interface MovieResult {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    poster_path?: string | null;
    backdrop_path?: string | null;
    popularity: number;
    genre_ids?: number[];
    adult?: boolean;
    original_language: string;
    video?: boolean;
}

export interface FilteredResult {
    id: number;
    overview: string;
    vote_average: number;
    title?: string;
    original_title?: string;
    release_date?: string;
    name?: string;
    original_name?: string;
    first_air_date?: string;
}

export type Sourse = 'imdb_id' | 'youtube_id';
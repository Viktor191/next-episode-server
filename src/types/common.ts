export interface FindByIDResponse {
    movie_results: any[];
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

export type Sourse = 'imdb_id' | 'youtube_id';

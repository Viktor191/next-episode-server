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

export interface MovieResult {
    id: number; // Уникальный идентификатор фильма
    title: string; // Название фильма
    original_title: string; // Оригинальное название
    overview: string; // Описание фильма
    release_date: string; // Дата релиза
    vote_average: number; // Средний рейтинг
    poster_path?: string | null; // Путь к постеру
    backdrop_path?: string | null; // Путь к изображению фона
    popularity: number; // Популярность
    genre_ids?: number[]; // Жанры (ID жанров)
    adult?: boolean; // Флаг "только для взрослых"
    original_language: string; // Язык оригинала
    video?: boolean; // Флаг наличия видео
}

export type Sourse = 'imdb_id' | 'youtube_id';

// --------------------------------------------------
interface BaseResult {
    id: number;
    overview: string;
    vote_average: number;
}

export interface MovieResults extends BaseResult {
    title: string;
    original_title: string;
    release_date: string;
}

export interface TVResults extends BaseResult {
    name: string;
    original_name: string;
    first_air_date: string;
}

export type CombinedResult = MovieResults | TVResults;
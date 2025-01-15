import {Document, Schema, model} from "mongoose";

interface IShow extends Document {
    title: string;
    ids: string[];
}

const ShowSchema = new Schema<IShow>({
    title: {type: String},
    ids: {type: [String], required: true},
});

export const ShowModel = model<IShow>('ShowModel', ShowSchema, 'shows');

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
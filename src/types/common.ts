import {TVResult} from "models/showModel";

export type SelectedTVResult = Pick<TVResult, 'id' | 'name' | 'overview' | 'first_air_date' | 'vote_average'>;
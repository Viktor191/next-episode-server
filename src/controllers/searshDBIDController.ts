import {Request, Response} from "express";
import {findByDbID} from "controllers/findByIDApiController";
import {SelectedTVResult} from "types/common";

// Поиск фильма по TMDB ID
export const getMovieDetailsByDbID = async (req: Request, res: Response): Promise<void> => {
    try {
        const apiResponse = await findByDbID(req.params.dbId);

        if (apiResponse) {
            const filteredResult: SelectedTVResult = {
                id: apiResponse.id,
                name: apiResponse.title || apiResponse.original_title,
                overview: apiResponse.overview,
                first_air_date: apiResponse.release_date || apiResponse.first_air_date,
                vote_average: apiResponse.vote_average,
            };
            res.status(200).json(filteredResult);
        } else {
            res.status(404).json({message: "No movie found for the given TMDB ID"});
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
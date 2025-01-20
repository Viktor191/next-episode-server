import {Request, Response} from "express";
import {findByID} from "controllers/findByIDApiController";
import {SelectedTVResult} from "types/common";

// поиск сериала по IMDb ID
export const getTVDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const apiResponse = await findByID(req.params.imdbId);

        if (apiResponse.tv_results && apiResponse.tv_results.length > 0) {
            const result = apiResponse.tv_results[0];

            const filteredResult: SelectedTVResult = {
                id: result.id,
                name: result.name,
                overview: result.overview,
                first_air_date: result.first_air_date,
                vote_average: result.vote_average,
            };
            res.status(200).json(filteredResult);
        } else {
            res.status(404).json({message: "No TV results found for the given IMDb ID"});
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
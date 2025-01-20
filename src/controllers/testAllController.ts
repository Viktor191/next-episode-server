import {fetchFromTMDB, processApiResponse} from "controllers/fetchController";
import {Request, Response} from "express";
import {FindByIDResponse} from "types/common";

export const getMovieByImdbID = async (req: Request, res: Response): Promise<void> => {
    try {
        const imdbID = req.params.imdbID;

        if (!imdbID) {
            res.status(400).json({message: "IMDb ID is required"});
            return;
        }

        const endpoint = `/find/${imdbID}`;
        const params = {external_source: "imdb_id"};

        const apiResponse = await fetchFromTMDB<FindByIDResponse>(endpoint, params);

        if (!apiResponse) {
            res.status(404).json({message: "No results found for the given IMDb ID"});
            return;
        }

        const filteredResult = processApiResponse(apiResponse);

        if (filteredResult) {
            res.status(200).json(filteredResult);
        } else {
            res.status(404).json({message: "No results found for the given IMDb ID"});
        }
    } catch (error) {
        console.error("Error fetching movie by IMDb ID:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
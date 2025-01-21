import {Request, Response} from "express";
import {fetchFromTMDBID} from "controllers/fetchController";
import {filterDbIDResponse} from "controllers/fetchController";
import {MovieResult, TVResult} from "types/common";

export const getDetailsByDbID = async (req: Request, res: Response): Promise<void> => {
    try {
        const dbID = req.params.dbID;

        if (!dbID) {
            res.status(400).json({message: "TMDB ID is required"});
            return;
        }

        try {
            const movieData = await fetchFromTMDBID<MovieResult>(dbID, "movie");
            const filteredMovieData = filterDbIDResponse(movieData);
            if (filteredMovieData) {
                res.status(200).json(filteredMovieData);
                return;
            }
        } catch {
            console.log(`ID ${dbID} не найден как фильм. Попробуем как сериал.`);
        }

        try {
            const tvData = await fetchFromTMDBID<TVResult>(dbID, "tv");
            const filteredTVData = filterDbIDResponse(tvData);
            if (filteredTVData) {
                res.status(200).json(filteredTVData);
                return;
            }
        } catch {
            console.log(`ID ${dbID} не найден как сериал.`);
        }

        res.status(404).json({message: "No results found for the given TMDB ID"});
    } catch (error) {
        console.error("Error fetching details by TMDB ID:", error);
        res.status(500).json({message: "Internal server error"});
    }
};
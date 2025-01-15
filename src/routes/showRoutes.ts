import {Router} from "express";
import {findByID} from "controllers/externalApiController";
import {TVResult} from "models/showModel";

const router = Router();

type SelectedTVResult = Pick<TVResult, 'id' | 'name' | 'overview' | 'first_air_date' | 'vote_average'>;

router.get("/", async (req, res) => {
    const data = await findByID('tt0944947');
    console.log(data.tv_results[0]);

    res.status(200).send(req.query.q);

})

router.get("/:imdbId", async (req, res) => {
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
});

router.post("/:imdbId/favorite", (req, res) => {
    res.status(200).send(req.params.imdbId);
})

export default router;
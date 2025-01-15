import {Router} from "express";
import {findByID} from "controllers/externalApiController";
import {TVResult} from "models/showModel";
import {getTVDetails} from "controllers/showController";

const router = Router();

type SelectedTVResult = Pick<TVResult, 'id' | 'name' | 'overview' | 'first_air_date' | 'vote_average'>;

router.get("/", async (req, res) => {
    const data = await findByID('tt0944947');
    console.log(data.tv_results[0]);

    res.status(200).send(req.query.q);
})

router.get("/:imdbId", getTVDetails);

router.post("/:imdbId/favorite", (req, res) => {
    res.status(200).send(req.params.imdbId);
})

export default router;
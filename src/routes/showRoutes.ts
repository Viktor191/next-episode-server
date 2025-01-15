import {Router} from "express";
import {findByID} from "controllers/externalApiController";
import {getTVDetails} from "controllers/showController";

const router = Router();

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
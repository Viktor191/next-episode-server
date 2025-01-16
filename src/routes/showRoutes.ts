import {Router} from "express";
import {findByID} from "controllers/findByIDApiController";
import {getTVDetails} from "controllers/showController";
import {searchMovie} from "controllers/searchController";

const router = Router();

router.get('/search', searchMovie);

router.get("/:imdbId", getTVDetails);

router.post("/:imdbId/favorite", (req, res) => {
    res.status(200).send(req.params.imdbId);
})

export default router;
import {Router} from "express";
import {getTVDetails} from "controllers/showController";
import {searchMovie} from "controllers/searchController";
import {getMovieDetailsByDbID} from "controllers/searshDBIDController";

import {getMovieByImdbID} from "controllers/testAllController";

const router = Router();
router.get("/find/imdb/:imdbID", getMovieByImdbID);

router.get("/search/db/:dbId", getMovieDetailsByDbID);

router.get('/search', searchMovie);

router.get("/:imdbId", getTVDetails);

router.post("/:imdbId/favorite", (req, res) => {
    res.status(200).send(req.params.imdbId);
})

export default router;
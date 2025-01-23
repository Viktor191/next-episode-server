import {Router} from "express";
import {getMovieByName} from "controllers/showController";
import {getTvByName, getMovieByDbID, getTvByDbID, getMovieByImdbID} from "controllers/showController";

const router = Router();

router.get("/imdb/:imdbID", getMovieByImdbID);

router.get("/movie/:dbID", getMovieByDbID);
router.get("/tv/:dbID", getTvByDbID);

router.get('/search/movie/:name', getMovieByName);
router.get('/search/tv/:name', getTvByName);

router.post("/:imdbId/favorite", (req, res) => {
    res.status(200).send(req.params.imdbId);
})

export default router;
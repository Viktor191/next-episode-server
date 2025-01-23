import {Router} from "express";
import {getMovieByName} from "controllers/searchController";
import {getMovieByDbID, getTvByDbID} from "controllers/dbIDController";
import {getMovieByImdbID} from "controllers/imdbIDController";
import {getTvByName} from "controllers/searchController";

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
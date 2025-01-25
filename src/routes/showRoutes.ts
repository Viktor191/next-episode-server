import {Router} from "express";
import {
    getMovieByName,
    getTvByName,
    getMovieByDbID,
    getTvByDbID,
    getMovieByImdbID,
} from "controllers/showController";

const router = Router();

router.get("/imdb/:imdbID", getMovieByImdbID);

router.get("/movie/:dbID", getMovieByDbID);
router.get("/tv/:dbID", getTvByDbID);

router.get('/search/movie/:name', getMovieByName);
router.get('/search/tv/:name', getTvByName);

export default router;
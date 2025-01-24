import {Router} from "express";
import {
    addToFavorites,
    getMovieByName,
    getTvByName,
    getMovieByDbID,
    getTvByDbID,
    getMovieByImdbID,
    getFavorites
} from "controllers/showController";

const router = Router();

router.get("/imdb/:imdbID", getMovieByImdbID);

router.get("/movie/:dbID", getMovieByDbID);
router.get("/tv/:dbID", getTvByDbID);

router.get('/search/movie/:name', getMovieByName);
router.get('/search/tv/:name', getTvByName);

router.post('/add/favorites', addToFavorites);
router.get('/favorites', getFavorites);

export default router;
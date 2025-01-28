import {Router} from "express";
import {
    getMovieByName,
    getTvByName,
    getMovieByDbID,
    getTvByDbID,
    getMovieByImdbID,
    addToFavorites,
    deleteFromFavorites,
} from "controllers/showController";

const router = Router();

router.get("/imdb/:imdbID", getMovieByImdbID);
router.get("/movie/:dbID", getMovieByDbID);
router.get("/tv/:dbID", getTvByDbID);
router.get('/search/movie/:name', getMovieByName);
router.get('/search/tv/:name', getTvByName);
router.post('/:dbID/favorites', addToFavorites);
router.delete('/:dbID/favorites', deleteFromFavorites);

export default router;
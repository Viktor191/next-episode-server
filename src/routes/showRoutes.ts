import {Router} from 'express';

import {
    getMovieByName,
    getTvByName,
    getMovieByDbID,
    getTvByDbID,
    getMovieByImdbID,
    addToFavorites,
    deleteFromFavorites,
    getUpcomingMovies,
} from 'controllers/showController';

const router = Router();

router.get('/imdb/:imdbID', getMovieByImdbID);
router.get('/movie/:dbID', getMovieByDbID);
router.get('/tv/:dbID', getTvByDbID);
router.get('/search/movie/:name', getMovieByName);
router.get('/search/tv/:name', getTvByName);
router.post('/:dbID/favorites', addToFavorites);
router.delete('/:id/favorites', deleteFromFavorites);
router.get('/upcoming', getUpcomingMovies);

export default router;

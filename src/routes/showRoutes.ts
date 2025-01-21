import { Router } from "express";
import { getMovieByName } from "controllers/searchController";
import { getMovieByDbID } from "controllers/dbIDController";
import { getMovieByImdbID } from "controllers/showController";

const router = Router();

router.get("/imdb/:imdbID", getMovieByImdbID);

router.get("/db/:dbID", getMovieByDbID);

router.get("/search", getMovieByName);

router.post("/:imdbId/favorite", (req, res) => {
  res.status(200).send(req.params.imdbId);
});

export default router;

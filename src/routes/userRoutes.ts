import {Router} from "express";
import {addToFavorites, deleteFromFavorites, getFavorites, getFavoritesDetails} from "../controllers/userController";

const router = Router();

router.post('/add/favorites', addToFavorites);
router.delete('/delete/favorites', deleteFromFavorites);

router.get('/me/favorites', getFavorites);

router.get("/me/details", getFavoritesDetails);

export default router;
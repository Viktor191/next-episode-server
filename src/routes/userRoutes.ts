import {Router} from "express";
import {addToFavorites, getFavorites} from "../controllers/userController";

const router = Router();

router.post('/add/favorites', addToFavorites);

router.get('/me/favorites', getFavorites);

router.get("/me", (req, res) => {
    res.status(200).send('response /user/me');
})

export default router;
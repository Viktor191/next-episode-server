import {Router} from "express";
import {getFavorites} from "controllers/userController";

const router = Router();

router.get('/me/favorites', getFavorites);

export default router;
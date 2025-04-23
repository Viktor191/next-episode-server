import {Router} from "express";
import {getFavorites, getMe, updateMe} from "controllers/userController";
import {authenticateToken} from "middlewares/authenticateToken";

const router = Router();

router.get('/me/favorites', getFavorites);
router.get("/me", authenticateToken, getMe);
router.patch("/me", authenticateToken, updateMe);


export default router;
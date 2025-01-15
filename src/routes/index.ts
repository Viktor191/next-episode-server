import {Router} from 'express';
import showRoutes from "routes/showRoutes";
import authRoutes from "routes/authRoutes";
import userRoutes from "routes/userRoutes";
import {authenticateToken} from "middlewares/authenticateToken";

const router = Router();

router.use('/shows', authenticateToken, showRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);


export default router;

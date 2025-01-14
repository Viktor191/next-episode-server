import { Router } from 'express';
import showRoutes from "routes/showRoutes";
import authRoutes from "routes/authRoutes";
import userRoutes from "routes/userRoutes";

const router = Router();

router.use('/shows', showRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);


export default router;

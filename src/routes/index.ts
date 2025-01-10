import { Router } from 'express';
import showRoutes from "routes/showRoutes";
import authRoutes from "routes/authRoutes";

const router = Router();

router.use('/shows', showRoutes);
router.use('/auth', authRoutes);



export default router;

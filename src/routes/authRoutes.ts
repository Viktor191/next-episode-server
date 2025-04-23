import {Router} from 'express';
import {forgotpassword, login, register, resetPassword} from "controllers/authController";
import {googleLogin} from "controllers/googleAuthController";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password", resetPassword);

export default router;
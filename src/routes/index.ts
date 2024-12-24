import { Router } from "express";

import { registerRoute } from "./authRoutes";

const router: Router = Router();

router.use("/auth", registerRoute);

export default router;

import { Router } from "express";

const router= Router();

router.get("/me", (req,res) => {
    res.status(200).send('response /user/me');
})

router.get("/me/favorites", (req,res) => {
    console.log('response /user/me/favorites');
    res.status(200).send('response /user/me/favorites');
})

export default router;
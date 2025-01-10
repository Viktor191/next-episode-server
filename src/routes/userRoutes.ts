import {Router} from "express";

const router= Router();

router.get("/user/me", (req,res    ) => {
    res.status(200).send('response /user/me');
})

router.get("/user/me/favorites", (req,res    ) => {
    console.log('response /user/me/favorites');
    res.status(200).send('response /user/me/favorites');
})

export default router;
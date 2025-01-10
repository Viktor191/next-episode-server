import {Router} from "express";

const router    = Router();

router.get("/", (req,res    ) => {
    res.status(200).send(req.query.q);
})

router.get("/:imdbId", (req,res    ) => {
    res.status(200).send(req.params.imdbId);
})

router.post("/:imdbId/favorite", (req,res    ) => {
    res.status(200).send(req.params.imdbId);
})
export default router;
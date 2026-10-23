import Express, { Request, Response } from "express";

const router = Express.Router();

router.get("/", async ( Req: Request, Res: Response ) => {
    try {
        return Res.status(201).json({ body: "IN DEVELOPMENT", success: true })
    } catch {
        return Res.status(500).json({ body: null, success: false })
    }
})

export default router;
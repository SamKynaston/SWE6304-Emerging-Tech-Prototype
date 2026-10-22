import Express, { Request, Response } from "express";

const router = Express.Router();

router.get("/", async function(req: Request, response: Response) {
    return response.json({ body: "test" })
})

export default router;
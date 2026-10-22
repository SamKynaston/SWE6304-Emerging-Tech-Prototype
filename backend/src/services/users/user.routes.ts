import Express, { Request, Response } from "express";
import { User } from "./user.model";

const router = Express.Router();

router.get("/", async function(req: Request, response: Response) {
    try {
        const users = await User.findAll()
        return response.status(201).json({ body: users, success: true })
    } catch {
        return response.status(500).json({ body: null, success: false })
    }
})

export default router;
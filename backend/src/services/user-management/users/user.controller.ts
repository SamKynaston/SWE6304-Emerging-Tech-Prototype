// Express
import { Request, Response } from "express";

// Model
import { User } from "./user.model";

export const GET_ALL_USERS = async ( Req: Request, Res: Response ) => {
    try {
        const users = await User.findAll()
        return Res.status(201).json({ body: users, success: true })
    } catch {
        return Res.status(500).json({ body: null, success: false })
    }
}
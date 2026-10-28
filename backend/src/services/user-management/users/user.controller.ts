// Express
import { Request, Response } from "express";

// Type
import { User } from "@prototype/types";

// Model
import { UserModel } from "./user.model";

export const GET_ALL_USERS = async ( Req: Request, Res: Response ) => {
    try {
        const users: User[] = await UserModel.findAll();
        return Res.status(200).json({ body: users, response: Req.body.response, success: true })
    } catch {
        return Res.status(500).json({ body: null, success: false })
    }
}
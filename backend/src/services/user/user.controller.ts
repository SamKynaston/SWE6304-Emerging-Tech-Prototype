// Express
import { Request, Response } from "express";

// Type
import { User } from "@prototype/types";

// Model
import { RoleModel, UserModel } from "../../models";

export const GET_ALL_USERS = async ( Req: Request, Res: Response ) => {
    try {
        const users: User[] = await UserModel.findAll({
            attributes: { exclude: ["password"] }, // ALWAYS exclude the hashed password
            include: [
                {
                    model: RoleModel,
                    as: "role",
                }
            ]
        });
        return Res.status(200).json({ body: users, success: true })
    } catch {
        return Res.status(500).json({ body: null, success: false })
    }
}
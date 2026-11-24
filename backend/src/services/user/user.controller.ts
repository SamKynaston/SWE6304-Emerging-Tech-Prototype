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

export const GET_USER = async ( Req: Request, Res: Response ) => {
    try {
        if (!Req.params.id) {
            Error("ID not specified")
        }

        const user: User = await UserModel.findOne({
            where: {
                id: Number(Req.params.id)
            },
            
            attributes: { exclude: ["password"] }, // ALWAYS exclude the hashed password
            include: [
                {
                    model: RoleModel,
                    as: "role",
                }
            ],

            rejectOnEmpty: true,
        });

        return Res.status(200).json({ body: user, success: true })
    } catch (exc) {
        console.log(exc)
        return Res.status(500).json({ body: null, success: false })
    }
}
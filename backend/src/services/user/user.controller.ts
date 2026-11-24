// Express
import { Request, Response } from "express";

// Type
import { User } from "@prototype/types";

// Model
import { RoleModel } from "../../models/role.model";
import { UserModel } from "../../models/user.model";

// User Utils
import { registerNewUser, authenticateExistingUser } from "../../utils/user";

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
        return Res.status(500).json({ body: null, success: false })
    }
}

export const CREATE_USER = async ( Req: Request, Res: Response) => {
    try {
        const { username, password, email } = Req.body;
        await registerNewUser(username, password, email);

        const token = await authenticateExistingUser(email, password)

        Res.cookie(process.env.SESSION_TOKEN_NAME || "SESSION_TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", 
            path: "/",
        });

        return Res.status(201).json({ success: true })
    } catch (exc) {
        return Res.status(500).json({ success: false })
    }
}
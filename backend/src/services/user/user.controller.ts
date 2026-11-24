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
        const id = Req.params.id === undefined ? Req.user?.id : Number(Req.params.id);
        if (id === undefined) {
            return Res.status(401).json({ body: null, success: false });
        }
        if (!Number.isSafeInteger(id) || id < 0) {
            return Res.status(400).json({ body: null, success: false });
        }

        const user = await UserModel.findOne({
            where: {
                id
            },
            
            attributes: { exclude: ["password"] }, // ALWAYS exclude the hashed password
            include: [
                {
                    model: RoleModel,
                    as: "role",
                }
            ],

        });

        if (!user) {
            return Res.status(404).json({ body: null, success: false });
        }

        return Res.status(200).json({ body: user, success: true })
    } catch (exc) {
        console.log(exc)
        return Res.status(500).json({ body: null, success: false })
    }
}

export const CREATE_USER = async ( Req: Request, Res: Response) => {
    try {
        const { email, forename, surname, password } = Req.body;

        const user: User = await registerNewUser(email, forename, surname, password);
        const token: String = await authenticateExistingUser(email, password)

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

export const AUTHENTICATE_USER = async (req: Request, res: Response) => {
    try {
        // Get their email and password from the request's body
        const { email, password } = req.body;

        let token = await authenticateExistingUser(email, password);

        res.cookie(process.env.SESSION_TOKEN_NAME || "SESSION_TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax", 
            path: "/",
        });

        // Return success
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Incorrect credentials" });
    }
};

export const LOGOUT_USER = async (req: Request, res: Response) => {
    try {
        res.clearCookie(process.env.SESSION_TOKEN_NAME || "SESSION_TOKEN", {
            httpOnly: true,
            secure: false,
            sameSite: "lax", 
            path: "/",
        });

        // Return a success
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
}
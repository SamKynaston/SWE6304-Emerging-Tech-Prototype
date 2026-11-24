import { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";
import jwt from "jsonwebtoken";
import { UserModel, RoleModel, PermissionModel } from "../models";

// Uses a ZOD schema in order to parse the body of a request and confirm its format meets what is expected.
export const VALIDATE_INPUT = (schema: ZodObject) => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error.issues[0].message })
        }

        req.body = result.data
        next()
    }
}

export const IS_USER_AUTHENTICATED = async ( req: Request, res: Response, next: NextFunction ) => {
    try {
        const token = req.cookies[process.env.SESSION_TOKEN_NAME || "SESSION_TOKEN"];

        if (!token) {
            return res.status(401).json({ success: false, error: "No cookie detected" });
        };

        // Verify the token is legitimate
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number, email: string, };

        // Get the user from the decoded token's username and email, including their roles and permissions
        const user = await UserModel.findOne({
            where: { id: decoded.id },
            attributes: { exclude: ["password"] },
        })

        // Return 401 if there is no user
        if (!user) {
            return res.status(401).json({ success: false, error: "Authentication failed." });
        }

        // Set the request's user accordingly
        req.user = user;

        next();
    } catch (err) {
        res.status(401).json({ success: false, error: "Authentication failed." });
    }
}
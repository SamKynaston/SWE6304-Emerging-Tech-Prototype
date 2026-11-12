// Express
import { Request, Response } from "express";

// Type
import { Role } from "@prototype/types";

// Model
import { RoleModel, PermissionModel } from "../../models";

export const GET_ALL_ROLES = async ( Req: Request, Res: Response ) => {
    try {
        const roles: Role[] = await RoleModel.findAll({
            include: [
                {
                    model: PermissionModel,
                    as: "permissions"
                }
            ]
        });
        return Res.status(200).json({ body: roles, success: true })
    } catch (exc) {
        console.log(exc)
        return Res.status(500).json({ body: null, success: false })
    }
}
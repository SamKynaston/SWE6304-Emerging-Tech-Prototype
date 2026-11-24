// Express
import { Request, Response } from "express";

export const GET_CURRENT_HEALTH = async ( Req: Request, Res: Response ) => {
    try {
        return Res.status(200).json({ body: { isHealthy: true, inReadOnly: false, isInMaintenance: false }, success: true })
    } catch {
        return Res.status(500).json({ body: null, success: false })
    }
}
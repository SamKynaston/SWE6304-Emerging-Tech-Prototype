// Express
import { Request, Response } from "express";

export const TEST_ROUTE = async ( Req: Request, Res: Response ) => {
    try {
        return Res.status(200).json({ success: true })
    } catch {
        return Res.status(500).json({ success: false })
    }
}
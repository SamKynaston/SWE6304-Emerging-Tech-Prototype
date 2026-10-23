// Express
import { Request, Response, NextFunction } from "express";

export const SEND_REQUEST_TO_MODEL = async ( Req: Request, Res: Response, Next: NextFunction ) => {
    const response = await fetch(`http://host.docker.internal:8080/internal/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: "what is cloud compute. be as thorough and detailed as possible. do not use markup or any other design, just write in plain english." }),
    });

    Req.body ??= {};
    Req.body.response = await response.json();
    Next();
}
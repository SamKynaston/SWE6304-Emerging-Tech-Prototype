// Express
import { Request, Response, NextFunction } from "express";

export const SEND_REQUEST_TO_MODEL = async ( Req: Request, Res: Response, Next: NextFunction ) => {
    const response = await fetch(`http://host.docker.internal:1234/api/v1/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "google/gemma-4-e4b", input: "what is cloud compute. be as thorough and detailed as possible. do not use markup or any other design, just write in plain english." }),
    });

    Req.body ??= {};
    Req.body.response = await response.json();
    Next();
}

export const SEND_REQUEST_TO_MODEL_DEMO = async ( input: string ) => {
    const response = await fetch(`http://host.docker.internal:1234/api/v1/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "google/gemma-4-e4b", input: input }),
    });

    if (!response.ok) {
        throw new Error(`Model request failed with status ${response.status}`);
    }

    const result: unknown = await response.json();
    const text = extractGeneratedText(result);
    if (!text?.trim()) {
        throw new Error("Model response did not contain generated text");
    }

    return text;
}

function extractGeneratedText(value: unknown): string | null {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
        return value.map(extractGeneratedText).filter((part): part is string => part !== null).join("");
    }
    if (!isRecord(value)) return null;

    for (const key of ["text", "content", "output", "choices", "message", "response"]) {
        if (key in value) {
            const text = extractGeneratedText(value[key]);
            if (text !== null) return text;
        }
    }

    return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}
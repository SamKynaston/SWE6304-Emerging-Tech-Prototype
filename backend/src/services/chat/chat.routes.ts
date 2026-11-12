import Express, { Request, Response } from "express";
import { TEST_ROUTE } from "./chat.controller";

const router = Express.Router();

router.get("/", TEST_ROUTE)

export default router;
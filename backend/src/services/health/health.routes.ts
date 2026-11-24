import Express, { Request, Response } from "express";

import { GET_CURRENT_HEALTH } from "./health.controller";

const router = Express.Router();

router.get("/", GET_CURRENT_HEALTH)

export default router;
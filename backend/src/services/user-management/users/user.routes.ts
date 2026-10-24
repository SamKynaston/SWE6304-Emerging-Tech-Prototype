import Express, { Request, Response } from "express";
import { GET_ALL_USERS } from "./user.controller";

const router = Express.Router();

router.get("/", GET_ALL_USERS)

export default router;
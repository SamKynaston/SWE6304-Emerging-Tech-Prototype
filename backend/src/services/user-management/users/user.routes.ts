import Express, { Request, Response } from "express";
import { GET_ALL_USERS } from "./user.controller";
import { SEND_REQUEST_TO_MODEL } from "../../../middleware/models.middleware";

const router = Express.Router();

router.get("/", SEND_REQUEST_TO_MODEL, GET_ALL_USERS)

export default router;
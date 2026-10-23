import Express, { Request, Response } from "express";
import { GET_ALL_USERS } from "./users/user.controller";
import { VALIDATE_INPUT } from "../../middleware/validate.middleware";
import { SEND_REQUEST_TO_MODEL } from "../../middleware/models.middleware";

const router = Express.Router();

router.get("/", GET_ALL_USERS)

export default router;
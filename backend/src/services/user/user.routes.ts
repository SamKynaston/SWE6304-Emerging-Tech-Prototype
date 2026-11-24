import Express, { Request, Response } from "express";
import { GET_ALL_USERS, GET_USER, CREATE_USER } from "./user.controller";
import { VALIDATE_INPUT, IS_USER_AUTHENTICATED } from "../../middleware/validate.middleware";
import { UserCreationSchema } from "./user.schema";

const router = Express.Router();

router.get("/", IS_USER_AUTHENTICATED, GET_ALL_USERS)
router.get("/:id", IS_USER_AUTHENTICATED, GET_USER)
router.post("/", VALIDATE_INPUT(UserCreationSchema), CREATE_USER)

export default router;
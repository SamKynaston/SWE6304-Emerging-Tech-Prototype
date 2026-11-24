import Express, { Request, Response } from "express";
import { GET_ALL_USERS, GET_USER, CREATE_USER, AUTHENTICATE_USER, LOGOUT_USER  } from "./user.controller";
import { VALIDATE_INPUT, IS_USER_AUTHENTICATED } from "../../middleware/validate.middleware";
import { UserCreationSchema, UserAuthenticationSchema } from "./user.schema";

const router = Express.Router();

router.get("/", IS_USER_AUTHENTICATED, GET_ALL_USERS)
router.get("/me", IS_USER_AUTHENTICATED, GET_USER);
router.get("/:id", IS_USER_AUTHENTICATED, GET_USER)
router.post("/", VALIDATE_INPUT(UserCreationSchema), CREATE_USER)
router.post("/authenticate", VALIDATE_INPUT(UserAuthenticationSchema), AUTHENTICATE_USER);
router.post("/logout", IS_USER_AUTHENTICATED, LOGOUT_USER);

export default router;
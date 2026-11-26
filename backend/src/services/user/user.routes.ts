import Express, { Request, Response } from "express";
import { GET_ALL_USERS, GET_USER, CREATE_USER, AUTHENTICATE_USER, LOGOUT_USER, UPDATE_USER, CHECK_AUTHENTICATION } from "./user.controller";
import { VALIDATE_INPUT, IS_USER_AUTHENTICATED, OWNERSHIP_CHECK } from "../../middleware/validate.middleware";
import { UserCreationSchema, UserAuthenticationSchema, UserUpdateSchema } from "./user.schema";

const router = Express.Router();

router.get("/", IS_USER_AUTHENTICATED, GET_ALL_USERS)
router.get("/me", IS_USER_AUTHENTICATED, CHECK_AUTHENTICATION);
router.get("/:id", IS_USER_AUTHENTICATED, GET_USER)
router.put("/:id", IS_USER_AUTHENTICATED, OWNERSHIP_CHECK, VALIDATE_INPUT(UserUpdateSchema), UPDATE_USER)
router.post("/", VALIDATE_INPUT(UserCreationSchema), CREATE_USER)
router.post("/authenticate", VALIDATE_INPUT(UserAuthenticationSchema), AUTHENTICATE_USER);
router.post("/logout", IS_USER_AUTHENTICATED, LOGOUT_USER);

export default router;
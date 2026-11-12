import Express from "express";
import { GET_ALL_ROLES } from "./permissions.controller";

const router = Express.Router();

router.get("/", GET_ALL_ROLES)

export default router;
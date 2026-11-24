import Express from "express";
import { GET_ALL_ROLES, GET_ROLE } from "./permissions.controller";

const router = Express.Router();

router.get("/:id", GET_ROLE)
router.get("/", GET_ALL_ROLES)

export default router;
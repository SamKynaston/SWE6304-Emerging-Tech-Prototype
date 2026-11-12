import { Router } from "express";
import userRoutes from "./user.routes";
import { initialiseService } from "../../utils/start.service";
import { sequelize } from "../../utils/start.database";
import "../../models/associations";

async function start() {
    await sequelize.authenticate();

    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/users", userRoutes);

    await initialiseService("/v1", combinedRoutes)
}

start()
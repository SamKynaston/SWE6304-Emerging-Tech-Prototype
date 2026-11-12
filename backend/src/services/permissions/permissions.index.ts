import { Router } from "express";
import permissionRoutes from "./permission.routes";
import { initialiseService } from "../../utils/start.service";
import { sequelize } from "../../utils/start.database";

async function start() {
    await sequelize.authenticate();

    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/roles", permissionRoutes);

    await initialiseService("/v1", combinedRoutes)
}

start()
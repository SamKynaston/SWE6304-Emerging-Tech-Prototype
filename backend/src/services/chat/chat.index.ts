import { Router } from "express";
import { initialiseService } from "../../utils/start.service";
import { sequelize } from "../../utils/start.database";
import chatRoutes from "./chat.routes";

async function start() {
    await sequelize.authenticate();

    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/chat", chatRoutes)

    await initialiseService("/v1", combinedRoutes)
}

start()
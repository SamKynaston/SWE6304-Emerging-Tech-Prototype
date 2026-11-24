import { Router } from "express";
import healthRoutes from "./health.routes";
import { initialiseService } from "../../utils/start.service";

async function start() {
    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/", healthRoutes);

    await initialiseService("/", combinedRoutes)
}

start()
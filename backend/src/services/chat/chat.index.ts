import { Router } from "express";
import { WebSocket, WebSocketServer } from "ws";
import { initialiseService } from "../../utils/start.service";
import { sequelize } from "../../utils/start.database";
import chatRoutes from "./chat.routes";
import { SEND_REQUEST_TO_MODEL_DEMO } from "../../middleware/models.middleware";
import { REGISTER_WEBSOCKET_ROUTES } from "./chat.websockets";

async function start() {
    await sequelize.authenticate();

    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/chat", chatRoutes)

    await initialiseService("/v1", combinedRoutes, REGISTER_WEBSOCKET_ROUTES)
}

start()
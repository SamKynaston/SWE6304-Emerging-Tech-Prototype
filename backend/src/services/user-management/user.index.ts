import { Router } from "express";
import userRoutes from "./users/user.routes";
import permissionRoutes from "./permissions/permission.routes";
import { initialiseService } from "../../utils/start.service";
import { seedSampleUserData } from "./users/users.sample";
import { seedSampleRoleData } from "./permissions/permissions.sample";
import { sequelize } from "../../utils/start.database";

async function start() {
    await sequelize.authenticate();

    // 
    //  Listener
    //
    const combinedRoutes = Router();
    combinedRoutes.use("/users", userRoutes);
    combinedRoutes.use("/roles", permissionRoutes);

    await initialiseService("/v1", combinedRoutes)

    //
    // Database Configuration
    //
    if (process.env.ENVIRONMENT === "DEVELOPMENT") {
        await sequelize.sync({force: true})
        await seedSampleRoleData()
        await seedSampleUserData()
    }
}

start()
import "../models/associations";
import { sequelize } from "./start.database";
import { seedSampleData } from "../models/sample";

async function syncDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        await sequelize.sync();


        //
        // Database Configuration
        //
        if (process.env.ENVIRONMENT === "DEVELOPMENT") {
            await sequelize.sync({ force: true })
            await seedSampleData()
        }
    } finally {
        await sequelize.close();
    }
}

syncDatabase().catch((error: unknown) => {
    console.error("Database schema initialization failed:", error);
    process.exitCode = 1;
});

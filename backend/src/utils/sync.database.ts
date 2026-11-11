import "../models/associations";
import { sequelize } from "./start.database";

async function syncDatabase(): Promise<void> {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } finally {
        await sequelize.close();
    }
}

syncDatabase().catch((error: unknown) => {
    console.error("Database schema initialization failed:", error);
    process.exitCode = 1;
});

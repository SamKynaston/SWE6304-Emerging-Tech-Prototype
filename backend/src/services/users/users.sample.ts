import { sequelize } from "../../utils/start.database";
import { User } from "./user.model";

export async function seedSampleData() {
    await sequelize.sync({ force: true });

    await User.bulkCreate([
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ])
}
import { sequelize } from "../../../utils/start.database";
import { UserModel } from "./user.model";

export async function seedSampleData() {
    await sequelize.sync({ force: true });

    await UserModel.bulkCreate([
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ])
}
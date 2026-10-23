import { sequelize } from "../../../utils/start.database";
import { RoleModel } from "./Role.model.ts";

export async function seedSampleRoleData() {
    await sequelize.sync({ force: true });

    await RoleModel.bulkCreate([
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ])
}
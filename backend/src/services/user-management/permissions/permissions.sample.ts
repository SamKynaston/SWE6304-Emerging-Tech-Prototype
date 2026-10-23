import { sequelize } from "../../../utils/start.database";
import { RoleModel } from "./role.model";

export async function seedSampleRoleData() {
    await sequelize.sync({ force: true });

    await RoleModel.bulkCreate([
        { id: 1 },
        { id: 2 },
        { id: 3 },
    ])
}
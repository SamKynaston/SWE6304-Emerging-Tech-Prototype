import { RoleModel } from "./role.model";

export async function seedSampleRoleData() {
    await RoleModel.bulkCreate([
        { id: 1, name: "User" },
        { id: 2, name: "Admin" },
        { id: 3, name: "Bot" },
    ])
}
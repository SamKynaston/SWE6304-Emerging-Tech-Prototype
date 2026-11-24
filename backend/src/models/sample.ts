import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";
import { hashPassword } from "../utils/password";
import { PermissionModel } from "./permission.model";

export async function seedSampleData() {
    const sampleUsers = await Promise.all([
        { id: 0, email: "*", name: "System", password: await hashPassword("2eewe"), dob: Date.now(), must_reset_password: false, can_be_signed_into: false, },
        { id: 1, email: "sam.kynaston@kynno.co.uk", name: "Sam Kynaston", password: await hashPassword("test"), dob: Date.now(), must_reset_password: false },
        { id: 2, email: "john.doe@kynno.co.uk", name: "John Doe", password: await hashPassword("test"), dob: Date.now(), must_reset_password: true },
        { id: 3, email: "jane.doe@kynno.co.uk", name: "Jane Doe", password: await hashPassword("test"), dob: Date.now(), must_reset_password: false },
    ].map(async (user) => {
        const [instance] = await UserModel.findOrCreate({
            where: { email: user.email },
            defaults: user,
        });
        return instance;
    }));

    const samplePermissions = await Promise.all([
        { permission_string: "READ_USERS"},
        { permission_string: "WRITE_USERS"},
        { permission_string: "DELETE_USERS"},
        { permission_string: "ADMINISTRATOR"},
        { permission_string: "ROOT"},
    ].map(async (permission) => {
        const [instance] = await PermissionModel.findOrCreate({
            where: { permission_string: permission.permission_string },
            defaults: permission,
        });
        return instance;
    }));

    const sampleRoles = await Promise.all([
        { id: 0, name: "Root"},
        { id: 1, name: "User" },
        { id: 2, name: "Admin" },
    ].map(async (role) => {
        const [instance] = await RoleModel.findOrCreate({
            where: { name: role.name },
            defaults: role,
        });
        return instance;
    }));

    await sampleRoles[0].setPermissions([samplePermissions[4], samplePermissions[3], samplePermissions[2], samplePermissions[1], samplePermissions[0]]);
    await sampleRoles[1].setPermissions([samplePermissions[0]]);
    await sampleRoles[2].setPermissions([samplePermissions[3]]);

    await sampleUsers[0].setRole(sampleRoles[0]);
    await sampleUsers[1].setRole(sampleRoles[2]);
    await sampleUsers[2].setRole(sampleRoles[1]);
    await sampleUsers[3].setRole(sampleRoles[1]);
}
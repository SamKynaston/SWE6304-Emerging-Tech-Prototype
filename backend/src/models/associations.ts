import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";

UserModel.belongsTo(RoleModel, {
  foreignKey: "roleId",
  as: "role",
});

RoleModel.hasMany(UserModel, {
  foreignKey: "roleId",
  as: "users",
});
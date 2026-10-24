import { UserModel } from "./users/user.model";
import { RoleModel } from "./permissions/role.model";

UserModel.belongsTo(RoleModel, {
  foreignKey: "roleId",
  as: "role",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

RoleModel.hasMany(UserModel, {
  foreignKey: "roleId",
  as: "users",
});
import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";
import { TicketModel } from "./chat";
import { UserTicketMessageModel } from "./chat.message";
import { PermissionModel } from "./permission";

// User | Role relationship
UserModel.belongsTo(RoleModel, {
  foreignKey: "roleId",
  as: "role",
});

RoleModel.hasMany(UserModel, {
  foreignKey: "roleId",
  as: "users",
});

// Role | Permission relationship
PermissionModel.belongsToMany(RoleModel, {
  through: "RolePermission",
  foreignKey: "permissionId",
  otherKey: "roleId",
  as: "roles",
});

RoleModel.belongsToMany(PermissionModel, {
    through: "RolePermission",
    foreignKey: "roleId",
    otherKey: "permissionId",
    as: "permissions",
});

// Chat | User relationship
UserTicketMessageModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "sender",
});

UserTicketMessageModel.belongsTo(TicketModel, {
    foreignKey: "ticketId",
    as: "chat",
});

UserModel.hasMany(UserTicketMessageModel, {
    foreignKey: "userId",
    as: "messages",
});

TicketModel.hasMany(UserTicketMessageModel, {
    foreignKey: "ticketId",
    as: "messages",
});
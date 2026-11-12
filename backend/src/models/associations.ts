import { UserModel } from "./user.model";
import { RoleModel } from "./role.model";
import { TicketModel } from "./chat";
import { UserTicketMessageModel } from "./chat.message";

// User | Role relationship
UserModel.belongsTo(RoleModel, {
  foreignKey: "roleId",
  as: "role",
});

RoleModel.hasMany(UserModel, {
  foreignKey: "roleId",
  as: "users",
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
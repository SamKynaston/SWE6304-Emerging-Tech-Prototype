import { CreationOptional, DataTypes, Model, ForeignKey } from "sequelize";
import { sequelize } from "../utils/start.database";
import { TicketMessage, Ticket } from "@prototype/types";
import { User } from "@prototype/types";

export class UserTicketMessageModel extends Model implements TicketMessage {
    declare id: CreationOptional<number>;

    declare chatId: ForeignKey<Ticket["id"]>;
    declare userId: ForeignKey<User["id"]>;

    declare senderType: string;
    declare message: string;
    declare timestamp: CreationOptional<Date>;
}

UserTicketMessageModel.init(
  {
    id: {
      type: DataTypes.NUMBER,
      autoIncrement: true,
      primaryKey: true,
    },

    chatId: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },

    userId: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },

    senderType: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
    },
  },

  { sequelize, modelName: "UserTicketMessage", tableName: "ticket_messages"},
)
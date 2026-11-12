import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../utils/start.database";
import { Ticket } from "@prototype/types";

export class TicketModel extends Model implements Ticket {
  declare id: CreationOptional<number>;
  declare startedOn: Date;
  declare endedOn: Date | undefined;
  declare chatName: string;
  declare active: boolean;
}

TicketModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    startedOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    endedOn: {
      type: DataTypes.DATE,
    },

    chatName: {
        type: DataTypes.STRING
    },

    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
  },

  { sequelize, modelName: "Chat", tableName: "chats", timestamps: false},
)
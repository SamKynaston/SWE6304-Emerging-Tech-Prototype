import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utils/start.database";

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },

  {
    sequelize,
    modelName: "User",
    tableName: "users",
  },
)
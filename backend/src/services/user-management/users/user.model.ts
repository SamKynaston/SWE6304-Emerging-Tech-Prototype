import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utils/start.database";
import { User } from "@prototype/types";

export class UserModel extends Model implements User {
  declare id: CreationOptional<number>;
}

UserModel.init(
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
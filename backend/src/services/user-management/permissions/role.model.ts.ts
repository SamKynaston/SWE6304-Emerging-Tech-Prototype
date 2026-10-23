import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utils/start.database";
import { Role } from "@prototype/types";

export class RoleModel extends Model implements Role {
  declare id: CreationOptional<number>;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },

  { sequelize, modelName: "Role", tableName: "roles",},
)
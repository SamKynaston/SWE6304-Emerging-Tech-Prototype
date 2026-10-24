import { CreationOptional, DataTypes, Model } from "sequelize";
import { sequelize } from "../../../utils/start.database";
import { Role } from "@prototype/types";
import { UserModel } from "../users/user.model";

export class RoleModel extends Model implements Role {
  declare id: CreationOptional<number>;
  declare name: string;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    string: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },

  { sequelize, modelName: "Role", tableName: "roles",},
)


RoleModel.hasMany(UserModel, {
  foreignKey: "roleId",
  as: "users",
});
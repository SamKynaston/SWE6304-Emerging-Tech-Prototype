import { CreationOptional, DataTypes, Model, BelongsToManyAddAssociationsMixin } from "sequelize";
import { sequelize } from "../utils/start.database";
import { Role, RolePermission } from "@prototype/types";
import PermissionModel from "./permission.model";

export class RoleModel extends Model implements Role {
  declare id: CreationOptional<number>;
  declare name: string;
  declare permissions: RolePermission[];
  declare setPermissions: BelongsToManyAddAssociationsMixin<PermissionModel, number>;
}

RoleModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },

  { sequelize, modelName: "Role", tableName: "roles",},
)
import { DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "../utils/start.database";
import { PERMISSIONS_STRING, RolePermission } from "@prototype/types";

// The permission's database model, implementing its shared type
export class PermissionModel extends Model implements RolePermission {
  declare permissionId: CreationOptional<number>;
  declare permission_string: PERMISSIONS_STRING;
}

PermissionModel.init(
  {
    permissionId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    permission_string: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Permission",
  },
);

export default PermissionModel;
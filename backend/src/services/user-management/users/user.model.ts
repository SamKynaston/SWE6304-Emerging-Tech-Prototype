import { DataTypes, Model, CreationOptional, BelongsToManyHasAssociationMixin, BelongsToManyAddAssociationsMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyAddAssociationMixin } from "sequelize";
import { sequelize } from "../../../utils/start.database";
import { User } from "@prototype/types";
import { RoleModel } from "../permissions/role.model";
import { hashPassword } from "../../../utils/password";

export class UserModel extends Model implements User {
  declare id: CreationOptional<number>;
  declare email: string;
  declare name: string;
  declare password: string;
  declare must_reset_password: Boolean;

  declare setRoles: BelongsToManyAddAssociationsMixin<RoleModel, number>; 
  declare addRole: BelongsToManyAddAssociationMixin<RoleModel, number>;
  declare removeRole: BelongsToManyAddAssociationMixin<RoleModel, number>;
  declare hasRole: BelongsToManyHasAssociationMixin<RoleModel, number>;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    must_reset_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    }
  },

  {
    sequelize,
    modelName: "User",

    hooks: {
      beforeCreate: async (user: UserModel) => {
        if (user.password) {
          user.password = await hashPassword(user.password);
        }
      },
      
      beforeUpdate: async (user: UserModel) => {
        if (user.changed("password")) {
          user.password = await hashPassword(user.password);
        }
      },
    },
  },
)

UserModel.belongsTo(RoleModel, {
  foreignKey: "roleId",
  as: "role",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});
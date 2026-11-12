import {
  BelongsToSetAssociationMixin,
  CreationOptional,
  DataTypes,
  ForeignKey,
  Model,
} from "sequelize";
import { sequelize } from "../utils/start.database";
import { User } from "@prototype/types";
import { RoleModel } from "./role.model";
import { hashPassword } from "../utils/password";

export class UserModel extends Model implements User {
  declare id: CreationOptional<number>;
  declare email: string;
  declare name: string;
  declare password: string;
  declare must_reset_password: Boolean;
  declare can_be_signed_into: Boolean;
  declare dob: Date;
  declare setRole: BelongsToSetAssociationMixin<RoleModel, number>;
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

    dob: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    must_reset_password: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    can_be_signed_into: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
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
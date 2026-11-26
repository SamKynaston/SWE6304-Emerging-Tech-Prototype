import { UserModel } from "../models/user.model";
import { RoleModel } from "../models/role.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerNewUser = async (email: string, forename: string, surname: string, password: string, dob: Date) => {
  // Create the user in the database
  // NOTE: The model automatically hashes the password upon creation and all future updates
  const user = await UserModel.create({ email: email, forename: forename, surname: surname, password: password, dob: dob });
  
  // Gets the default user role. 
  const userRole = await RoleModel.findOne({
      where: { name: "User" },
  });

  // If found, assigns it to the user
  if (userRole) {
      await user.setRole(userRole);
  }

  // Return the user
  return user;
}

export const issueUserToken = async(targetId: number) => {
  const user = await UserModel.findByPk(targetId, { attributes: { exclude: ["password"] }});

  if (!user) {
    return null
  }

  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });
}

export const updateUser = async(targetId: number, toUpdate: { email: string, forename: string, surname: string, dob: Date }) => {
  const user = await UserModel.findByPk(targetId, { attributes: { exclude: ["password"] }});

  if (!user) {
    return false
  }

  if (toUpdate.email) user.email = toUpdate.email;
  if (toUpdate.forename) user.forename = toUpdate.forename;
  if (toUpdate.surname) user.surname = toUpdate.surname;
  if (toUpdate.dob) user.dob = toUpdate.dob;

  await user.save();

  return true
}

export const authenticateExistingUser = async (email: string, password: string) => {
  let user = null
  
  // If there is an email, check to see if the user exists in the records
  if (email) {
    user = await UserModel.findOne({ where: { email } });
  } else {
    // if no error is supplied, throw an error
    throw new Error("Invalid credentials");
  }

  if (!user) {
    // If the user doesn't exist, then throw an error
    throw new Error("Invalid credentials");
  }

  // Confirms the password matches cryptographically
  const isPasswordValid = await bcrypt.compare(password, user.password);

  // If not, then throw an error
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  if (!user.can_be_signed_into) {
    throw new Error("Invalid account");
  }

  // Issue a JWT token that expires in 24 hours.
  const token = await issueUserToken(user.id)

  // Return the token.
  return token;
}
import { UserModel } from "../models/user.model";
import { RoleModel } from "../models/role.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const CREATE_USER = async (username: string, password: string, email: string) => {
    // Create the user in the database
    // NOTE: The model automatically hashes the password upon creation and all future updates
    const user = await UserModel.create({ username, password, email });
    
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

export const AUTHENTICATE_USER = async (email: string, password: string) => {
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

  // Issue a JWT token that expires in 24 hours.
  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: "24h",
  });

  // Return the token.
  return token;
}
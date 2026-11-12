import { Role } from "./Role";

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  dob: Date;
  role: Role;
  can_be_signed_into: boolean;
  must_reset_password: boolean;
};
import { Role } from "./Role";

export type User = {
  id: number;
  email: string;
  name: string;
  password: string;
  dob: Date;
};
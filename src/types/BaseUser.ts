import { Roles } from "./role.enum.js";

export interface BaseUser {
  email: string;
  password: string;
  phone: string | null;
  role: Roles;
  username: string;
}

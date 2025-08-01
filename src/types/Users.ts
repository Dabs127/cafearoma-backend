export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  role: "Administrator" | "User";
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserBody {
  name?: string;
  email?: string;
  phone?: string;
}

export interface ForgotUserPasswordDto {
  email: string;
}

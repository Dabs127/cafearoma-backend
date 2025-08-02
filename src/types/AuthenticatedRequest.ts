import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload {
  userId: string;
  role: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload;
}

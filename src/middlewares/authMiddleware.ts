import {
  AuthenticatedRequest,
  JwtUserPayload,
} from "#types/AuthenticatedRequest.js";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined");
}

const secretKey = process.env.SECRET_KEY;

const verifyToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.access_token as string;
  console.log(token);
  console.log(req.cookies);
  if (token) {
    try {
      const decode = jwt.verify(token, secretKey) as JwtUserPayload;
      console.log(decode);
      req.user = decode;
      // console.log("validar", req.user);
      next();
    } catch (err) {
      console.error(err);
      res.status(400).json({
        message: "Token is not valid",
      });
    }
  } else {
    res.status(401).json({
      message: "No token, authorization denied",
    });
  }
};

export default verifyToken;

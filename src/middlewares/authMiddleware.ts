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
  let token: string | undefined;
  const authHeader = req.headers.Authorization ?? req.headers.authorization;
  console.log(req.cookies.access_token);

  if (typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    if (!token) {
      console.log("Entro aqui");
      res.status(401).json({
        message: "No token, authorization denied",
      });
      return;
    }

    try {
      const decode = jwt.verify(token, secretKey) as JwtUserPayload;
      req.user = decode;
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

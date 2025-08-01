import { AuthenticatedRequest } from "../types/AuthenticatedRequest.js";
import { NextFunction, Response } from "express";

const authorizeRoles = (...allowedRoles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    const user = req.user;

    if (!user || !allowedRoles.includes(user.role)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};

export default authorizeRoles;

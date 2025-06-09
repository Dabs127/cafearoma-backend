import { Roles } from "../types/role.enum.js";
import { User } from "../models/Users.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  AuthenticatedRequest,
  JwtUserPayload,
} from "#types/AuthenticatedRequest.js";

interface LoginBody {
  email: string;
  password: string;
}

interface RegisterBody {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

interface UserType {
  _id: number;
  email: string;
  password: string;
  phone?: string;
  role: Roles;
}

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined");
}

const secretKey = process.env.SECRET_KEY;

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, password }: LoginBody = req.body;

  let existingUser: UserType | null;
  try {
    existingUser = await User.findOne<Promise<UserType | null>>({
      email: email,
    });

    if (!existingUser) {
      res
        .status(404)
        .json({ success: false, message: "Correo o contraseña incorrectos" });
      return;
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: "Correo o contraseña incorrectos",
      });
      return;
    }
  } catch {
    const error = new Error("Error!");
    next(error);
    return;
  }

  let token: string;
  let refresh_token: string;
  try {
    token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    refresh_token = jwt.sign(
      {
        email: existingUser.email,
      },
      secretKey,
      { expiresIn: "30d" }
    );

    console.log("Token generated:", token);
  } catch (err) {
    console.error(err);
    const error = new Error("Error!");
    next(error);
    return;
  }
  console.log(token);

  res.cookie("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refresh_token", refresh_token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    data: {
      userId: existingUser._id,
      email: existingUser.email,
      message: "Inicio de sesión correcto",
    },
  });
};

export const registerUser = async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { username, email, password, phone }: RegisterBody = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const userExist = await User.findOne({ email: email });

  if (userExist) {
    res.status(409).json({
      success: false,
      data: {
        message: "Email already in use",
      },
    });
    return;
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    phone: phone ?? "",
    role: "User",
  });

  try {
    await newUser.save();
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(400).json({
      success: false,
      data: {
        message: "User couldn't be created",
      },
    });
    return;
  }

  let token: string;
  let refresh_token: string;

  try {
    token = jwt.sign(
      {
        userId: newUser.id as number,
        email: newUser.email,
        role: newUser.role,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    refresh_token = jwt.sign(
      {
        email: newUser.email,
      },
      secretKey,
      { expiresIn: "30d" }
    );
  } catch {
    res.status(400).json({
      false: false,
      data: {
        message: "Token could not be setted.",
      },
    });

    return;
  }

  res.cookie("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    data: {
      message: "Usuario creado correctamente",
      userId: newUser.id as number,
      email: newUser.email,
    },
  });
};

export const logoutUser = (req: Request, res: Response) => {
  res
    .clearCookie("access_token")
    .status(200)
    .json({
      data: {
        message: "Session closed successfully",
      },
    });
};

export const refreshToken = async (req: Request, res: Response) => {
  console.log("Refreshing token...");
  const token = req.cookies.refresh_token as string;
  if (!token) {
    res.status(401).json({
      data: {
        message: "No refresh token",
      },
    });
    return;
  }

  try {
    const payload = jwt.verify(token, secretKey) as JwtUserPayload;
    // console.log("Payload:", payload);
    const user = await User.findOne({
      email: payload.email,
    });

    const newAccessToken = jwt.sign(
      {
        email: user?.email,
        role: user?.role,
        userId: user?._id,
      },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("access_token", newAccessToken, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      message: "Access token refreshed correctly",
    });
    return;
  } catch {
    res.status(404).json({
      data: {
        message: "Invalid refresh token",
      },
    });
    return;
  }
};

export const getSession = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ authenticated: false });
    return;
  }

  const { id, email, role } = req.user;

  // console.log("User session:", req.user);

  res.json({
    authenticated: true,
    userId: id,
    email,
    role: role,
  });
};

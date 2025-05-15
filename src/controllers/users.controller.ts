import { User } from "../models/Users.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
  id: number;
  email: string;
  password: string;
  phone?: string;
}

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined");
}

const secretKey = process.env.SECRET_KEY;

export const LoginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { email, password }: LoginBody = req.body;

  let existingUser: UserType | null;
  try {
    existingUser = await User.findOne({ email: email });
  } catch {
    const error = new Error("Error!");
    next(error);
    return;
  }

  if (
    !existingUser ||
    existingUser.password !== password ||
    !existingUser.id ||
    !existingUser.email
  ) {
    console.error("Wrong details please check at once");
    return res.status(401).json({ message: "Credenciales invalidas" });
  }

  let token: string;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error(err);
    const error = new Error("Error!");
    next(error);
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
    },
  });
};

export const RegisterUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { username, email, password, phone }: RegisterBody = req.body;
  const newUser = new User({
    username,
    email,
    password,
    phone,
  });

  try {
    await newUser.save();
  } catch (err) {
    console.error(err);
    const error = new Error("Error!");
    next(error);
    return;
  }

  let token: string;

  try {
    token = jwt.sign(
      {
        userId: newUser.id as number,
        email: newUser.email,
      },
      secretKey,
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.error(err);
    const error = new Error("Error!");
    next(error);
    return;
  }

  res.status(201).json({
    success: true,
    data: {
      userId: newUser.id as number,
      email: newUser.email,
      token: token,
    },
  });
};

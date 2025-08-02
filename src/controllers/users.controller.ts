import { Roles } from "../types/role.enum.js";
import { User } from "../models/Users.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  AuthenticatedRequest,
  JwtUserPayload,
} from "../types/AuthenticatedRequest.js";
import { ForgotUserPasswordDto, UpdateUserBody } from "../types/Users.js";
import { ResetToken } from "../models/ResetTokens.js";
import { mailTemplate, sendEmail } from "../utils/email.js";

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

    // console.log("Token generated:", token);
  } catch (err) {
    console.error(err);
    const error = new Error("Error!");
    next(error);
    return;
  }
  // console.log(token);

  res.cookie("access_token", token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refresh_token", refresh_token, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
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
    sameSite: "none",
    maxAge: 1000 * 60 * 60,
  });

  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
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
  try {
    res
      .clearCookie("refresh_token")
      .clearCookie("access_token")
      .status(200)
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (err) {
    console.error("el error es este: ", err);
  }
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
      sameSite: "none",
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

  const { userId, email, role } = req.user;

  // console.log("User session:", req.user);

  res.json({
    authenticated: true,
    userId: userId,
    email,
    role: role,
  });
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ authenticated: false });
    return;
  }

  const { userId } = req.user;
  console.log("Fetching user by ID:", userId);

  try {
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { userId } = req.user;
    const { name, email, phone } = req.body as UpdateUserBody;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: name, email, phone },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
  return;
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { userId } = req.user;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res
      .clearCookie("refresh_token")
      .clearCookie("access_token")
      .status(200)
      .json({
        success: true,
        message: "User deleted successfully",
      });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (
  req: Request<unknown, unknown, ForgotUserPasswordDto>,
  res: Response
) => {
  try {
    const email: string = req.body.email;
    const user = await User.findOne({ email: email });

    if (!user) {
      res.json({
        success: false,
        message: "Your are not registered!",
      });
    } else {
      const token = crypto.randomBytes(20).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      await ResetToken.updateOne(
        { user_id: user._id },
        { token: hashedToken, expires_at: new Date(Date.now() + 3600000) },
        { upsert: true }
      );

      const mailOption = {
        email: user.email,
        subject: "Password Reset Request",
        message: mailTemplate(
          "You have requested a password reset. Click the button below to reset your password.",
          `${process.env.FRONTEND_URL ?? ""}/reset-password?id=${user._id.toString()}&token=${token}`,
          "Reset Password"
        ),
      };

      await sendEmail(mailOption);

      res.status(200).json({
        success: true,
        message: "We sent you a password reset email.",
      });
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while processing your request.",
    });
    return;
  }
};

export const resetPassword = async (
  req: Request<
    unknown,
    unknown,
    { password: string; confirm_password: string }
  >,
  res: Response
) => {
  try {
    const { id, token } = req.query;
    const { password } = req.body;

    console.log(req.query);
    console.log("Resetting password for user:", id);
    console.log("Reset token:", token);

    if (!id || !token) {
      res.status(400).json({
        success: false,
        message: "Invalid request parameters.",
      });
      return;
    }

    const resetToken = await ResetToken.findOne({
      user_id: id,
      token: crypto
        .createHash("sha256")
        .update(token as string)
        .digest("hex"),
    });

    console.log("Found reset token:", resetToken);

    if (!resetToken || resetToken.expires_at < new Date()) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset token.",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne({ _id: id }, { password: hashedPassword });
    await ResetToken.deleteOne({ _id: resetToken._id });

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password.",
    });
  }
};

export const sendEmailToAdmin = async (req: Request, res: Response) => {
  try {
    const { email, name, message } = req.body as {
      email: string;
      name: string;
      message: string;
    };

    const mailOption = {
      email: process.env.ADMIN_EMAIL ?? "dabsserna@gmail.com",
      subject: `Mensaje de usuario desde el sitio web - ${name}`,
      message: `Email from: ${email}<br><br>${message}`,
    };

    await sendEmail(mailOption);

    res.status(200).json({
      success: true,
      message: "Email sent successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while sending the email.",
    });
  }
};

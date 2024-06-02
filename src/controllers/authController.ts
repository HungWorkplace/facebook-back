import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { generateTokenAndCookieOptions } from "../helpers/generateTokenAndCookieOptions";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Mongoose will just receive the fields that are in the schema
    // Password will be hashed before saving
    const newUser = new User(req.body);
    await newUser.save();

    const { token, cookieOptions } = generateTokenAndCookieOptions(newUser);
    res.cookie("jwt", token, cookieOptions);

    // Remove password from the response
    // Prevent typescript from complaining about password being undefined
    Object.assign(newUser, { password: undefined });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const isMatch = await user.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const { token, cookieOptions } = generateTokenAndCookieOptions(user);
    res.cookie("jwt", token, cookieOptions);

    // Remove password from the response
    // Prevent typescript from complaining about password being undefined, use Object.assign
    Object.assign(user, { password: undefined });

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An error occurred" });
    }
  }
};

export const userRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | null = null;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (req.headers.authorization) {
    const authHeader = req.headers.authorization;
    token = authHeader.split(" ")[1];
  }

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById((decoded as any).id);
    if (!user) return next();

    req.user = user;
    next();
  } catch (error) {
    return next();
  }
};

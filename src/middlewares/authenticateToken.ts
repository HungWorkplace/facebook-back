// ! use authController instead of authenticateToken
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export default async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Check jwt in cookies or in headers bearer
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
}

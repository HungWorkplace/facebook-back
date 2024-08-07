import { Request, Response, NextFunction } from "express";
import User, { IUserDocument } from "../models/user";
import Image from "../models/image";
import { generateTokenAndCookieOptions } from "../helpers/generateTokenAndCookieOptions";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";
import { RequestWithUser } from "./post";

export const signup = catchAsync(async (req: Request, res: Response) => {
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
  const newUser = new User(req.body) as unknown as IUserDocument;
  await newUser.save();

  // Create a default avatar for the user
  const defaultImage = await Image.create({
    url: "https://res.cloudinary.com/dabwxshg6/image/upload/v1717579812/facebook/default-avatar.jpg",
    publicId: "default-avatar",
    isSuggested: true,
    author: newUser._id,
  });

  newUser.avatar = defaultImage._id.toString();
  await newUser.save();

  // Generate token and send it in a cookie
  const { token, cookieOptions } = generateTokenAndCookieOptions(newUser);
  res.cookie("jwt", token, cookieOptions);

  // Remove password from the response
  // Prevent typescript from complaining about password being undefined
  Object.assign(newUser, { password: undefined });

  // Add 5 friends to this user
  // ! Check _id in Database before adding friends. Because we are using the seed data
  const friends = [
    "665e6340a064336cb45b7046",
    "665e6340a064336cb45b7047",
    "665e6340a064336cb45b7048",
    "665e6340a064336cb45b7049",
    "665e6340a064336cb45b704a",
    "66603928d0b77a3b7a6d4fe3",
  ];

  let error = null;

  try {
    await User.updateOne(
      { _id: newUser._id },
      { $push: { friends: { $each: friends } } }
    );

    await User.updateMany(
      { _id: { $in: friends } },
      { $addToSet: { friends: newUser._id } }
    );
  } catch (error) {
    error = error;
  }

  res.status(201).json({
    message: "User created successfully",
    error,
    user: newUser,
    token,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = (await User.findOne({ email }).select(
    "+password"
  )) as IUserDocument;

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
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });
});

export const userRequest = async (
  req: RequestWithUser,
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

    req.user = user as unknown as IUserDocument;
    next();
  } catch (error) {
    return next();
  }
};

// Check token in cookies and headers, if it exists, add user to the request. if not, prevent access
export const protect = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: string | null = null;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization) {
      const authHeader = req.headers.authorization;
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ error: "You are not logged in" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById((decoded as any).id).populate(
      "avatar",
      "url"
    );

    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    req.user = user as unknown as IUserDocument;
    next();
  }
);

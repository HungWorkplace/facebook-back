import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import { generateTokenAndCookieOptions } from "../helpers/generateTokenAndCookieOptions";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync";

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
  const newUser = new User(req.body);
  await newUser.save();

  const { token, cookieOptions } = generateTokenAndCookieOptions(newUser);
  res.cookie("jwt", token, cookieOptions);

  // Remove password from the response
  // Prevent typescript from complaining about password being undefined
  Object.assign(newUser, { password: undefined });

  // Add 5 friends to this user
  const friends = [
    "665d9a89fd897a3a19fa2c75",
    "665d9a89fd897a3a19fa2c76",
    "665d9a89fd897a3a19fa2c77",
    "665d9a89fd897a3a19fa2c78",
    "665d9a89fd897a3a19fa2c79",
  ];

  let error = null;

  try {
    await User.updateMany(
      { _id: newUser._id },
      { $push: { friends: { $each: friends } } }
    );

    // Add this user to the friends list of the 5 users
    const billionaires = await User.find({ _id: { $in: newUser.friends } });
    for (const person of billionaires) {
      person.friends.push(newUser._id);
      await person.save();
    }

    // @ts-ignore
    newUser.friends = friends;
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
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("jwt");
  res.status(200).json({ message: "User logged out successfully" });
});

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

// Check token in cookies and headers, if it exists, add user to the request. if not, prevent access
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
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

    req.user = user;
    next();
  }
);

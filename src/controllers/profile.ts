import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import User, { IUserDocument } from "../models/user";
import { cloudinary } from "../config/cloudinary";

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

export const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const userRequest = req.user as IUserDocument;

  const user = await User.findByIdAndUpdate(
    userRequest._id,
    { avatar: req.file?.path },
    { new: true }
  );

  if (userRequest.avatar) {
    const publicId = userRequest.avatar.split("/").pop()?.split(".")[0];

    if (publicId) {
      await cloudinary.uploader.destroy("facebook/" + publicId);
    }
  }

  res.status(200).json({ user });
});

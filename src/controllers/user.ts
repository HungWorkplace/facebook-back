import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import User, { IUserDocument } from "../models/user";
import Image from "../models/image";
import { cloudinary } from "../config/cloudinary";

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

// getUserById
export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Please provide userId" });
    }

    const user = await User.findById(userId)
      .select("firstName surname fullName avatar gender friends createdAt")
      .populate("avatar", "url");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  }
);

export const uploadAvatar = catchAsync(async (req: Request, res: Response) => {
  const userRequest = req.user as IUserDocument;

  const image = await Image.create({
    url: req.file?.path,
    publicId: req.file?.filename,
    author: userRequest.id,
  });

  const user = await User.findByIdAndUpdate(
    userRequest.id,
    { avatar: image.id },
    { new: true }
  );

  // Delete the previous avatar image from cloudinary and image document if it exists
  if (userRequest.avatar) {
    const image = await Image.findByIdAndDelete(userRequest.avatar);

    if (image) {
      await cloudinary.uploader.destroy(image.publicId);
    }
  }

  res.status(200).json({
    user: {
      _id: user?._id,
      avatar: image.url,
    },
  });
});

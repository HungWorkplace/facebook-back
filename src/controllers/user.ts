import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import User from "../models/user";
import Image from "../models/image";
import { cloudinary } from "../config/cloudinary";
import { MulterRequest, RequestWithUser } from "./post";
import { suggestedImages } from "../seed/suggestedImages";

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  res.status(200).json({ user });
});

export const getFriends = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;
    // Find users whose id is in the friends array of the user
    const friends = await User.find({ _id: { $in: user.friends } })
      .select("firstName surname fullName avatar")
      .populate("avatar", "url");

    res.status(200).json({ friends });
  }
);

// getUserById
export const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Please provide userId" });
    }

    const user = await User.findById(userId)
      .select("-phone -email -birthday")
      .populate("avatar", "url");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  }
);

export const uploadAvatar = catchAsync(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    const { suggestedImage } = req.body;

    const userImage = await Image.findById(req.user.avatar);

    if (!userImage) {
      return res.status(400).json({
        error: "Image not found. Contact to the admin to delete this user",
      });
    }

    if (!req.file && !suggestedImage) {
      return res
        .status(400)
        .json({ error: "Please provide a file or a suggested image" });
    }

    // update the user avatar
    if (req.file) {
      if (userImage && !userImage.isSuggested) {
        await cloudinary.uploader.destroy(userImage.publicId);
      }

      userImage.url = req.file.path;
      userImage.publicId = req.file.filename;
      await userImage.save();
    } else {
      const defaultImage = suggestedImages.find(
        (image) => image.label === suggestedImage
      );

      if (defaultImage) {
        userImage.url = defaultImage.url;
        userImage.publicId = defaultImage.publicId;
        userImage.isSuggested = true;
        await userImage.save();
      }
    }

    res.status(200).json({
      avatar: {
        url: userImage.url,
        publicId: userImage.publicId,
        isSuggested: userImage.isSuggested,
      },
    });
  }
);

// change postPrivacy
export const updatePostPrivacy = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { postPrivacy } = req.body;

    if (!postPrivacy) {
      return res.status(400).json({ error: "Please provide postPrivacy" });
    }

    const matched = ["public", "private"].includes(postPrivacy);

    if (!matched) {
      return res.status(400).json({ error: "Invalid postPrivacy" });
    }

    await User.findByIdAndUpdate(req.user.id, {
      "userSettings.postPrivacy": postPrivacy,
    });

    res.status(200).json({ message: "Post privacy updated" });
  }
);

// Find images by userId and populate the images and populate the post of the images to get privacy
export const getImagesByUserId = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "Please provide userId" });
    }

    // find images by userId, post privacy should be public or the author of the post should be the user
    const images = await Image.find({ author: userId })
      .populate({
        path: "post",
        select: "privacy",
        match: {
          $or: [{ privacy: "public" }, { author: userId }],
        },
      })
      .select("url publicId isSuggested post")
      .lean();

    res.status(200).json({ images });
  }
);

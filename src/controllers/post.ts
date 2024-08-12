import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Post from "../models/post";
import Image from "../models/image";
import { IUserDocument } from "../models/user";
import { cloudinary } from "../config/cloudinary";

export type RequestWithUser = Request & { user: IUserDocument };

export interface MulterRequest extends RequestWithUser {
  files?: Express.Multer.File[];
}

// Create post
// If create post is failed, the images will not be saved to the database
export const createPost = catchAsync(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    const { content, privacy } = req.body;

    if (!content && !privacy) {
      if (req.files) {
        await Promise.all(
          req.files.map((file) => cloudinary.uploader.destroy(file.filename))
        );
      }

      return res
        .status(400)
        .json({ message: "Please provide content and privacy" });
    }

    const urlImages = req.files?.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const post = await Post.create({
      content,
      author: req.user.id,
      privacy,
    });

    // Create images if there are any images in the request body and save them to the post document and the Image collection
    if (urlImages) {
      const images = await Image.create(
        urlImages.map((urlImage) => ({
          ...urlImage,
          post: post.id,
          author: req.user.id,
        }))
      );
      post.images = images.map((image) => image.id);
      await post.save();
    }

    res.status(201).json({ post: { id: post.id, content: post.content } });
  }
);

// Delete post
export const deletePost = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    // find post by Id and author of it. If the post is not found or the author is not the user, return 404
    // Delete the images of the post from the Image collection and the cloudinary

    const post = await Post.findOne({
      _id: postId,
      author: req.user.id,
    }).populate("images");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await Image.deleteMany({ post: postId });

    if (post.images) {
      await Promise.all(
        // @ts-ignore
        post.images.map((image) => cloudinary.uploader.destroy(image?.publicId))
      );
    }

    await Post.findByIdAndDelete(postId);

    res.status(204).json({});
  }
);

// Get my posts
export const getMyPosts = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const posts = await Post.find({ author: req.user.id })
      .populate("images", "url")
      .populate("likes", "firstName surname fullName avatar")
      .exec();

    res.status(200).json({ posts });
  }
);

export const getPostsByUserId = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // find posts by userId, post privacy should be public or the author of the post should be the user
    const posts = await Post.find({
      author: userId,
      $or: [
        { privacy: "public" },
        { author: currentUserId }, // the author of the post is the user
      ],
    })
      .populate({
        path: "author",
        select: "-userSettings -phone -email -birthday",
        populate: { path: "avatar", select: "url" },
      })
      .populate("images", "url")
      .populate("comments")
      .sort({ createdAt: -1, "likes.length": -1 })
      .exec();

    res.status(200).json({ posts });
  }
);

// Get posts in news feed
export const getPostsInNewsFeed = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const posts = await Post.find({
      $or: [
        { author: { $in: req.user.friends }, privacy: "public" },
        { author: req.user.id },
      ],
    })
      .populate({
        path: "author",
        select: "-userSettings -phone -email -birthday",
        populate: { path: "avatar" },
      })
      .populate("images", "url")
      .populate("comments")
      .sort({ createdAt: -1, "likes.length": -1 })
      .exec();

    res.status(200).json({ posts });
  }
);

// Like post
export const likePost = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes?.includes(req.user.id)) {
      post.likes = post.likes?.filter(
        (userId) => userId.toString() !== req.user.id.toString()
      );
    } else {
      post.likes?.push(req.user.id);
    }

    await post.save();

    res.status(200).json({ post: { id: post.id, likes: post.likes } });
  }
);

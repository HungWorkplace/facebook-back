import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Post from "../models/post";

interface MulterRequest extends Request {
  files?: Express.Multer.File[];
}

// body: { content: string, images?: string[] }
export const createPost = catchAsync(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Please provide content" });
    }

    const urlImages = req.files?.map((file) => file.path);

    // Create post with content, images, author
    const post = await Post.create({
      content,
      images: urlImages,
      author: req.user!._id,
    });

    res.status(201).json({ post });
  }
);

// Delete post
export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const deletedPost = await Post.findOneAndDelete({
      _id: postId,
      author: req.user!._id,
    });

    // There is no permission to delete this post
    if (!deletedPost) {
      return res
        .status(403)
        .json({ message: "There is no permission to delete this post" });
    }

    res.status(204).json({});
  }
);

// Get posts
export const getPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get all posts with author, likes, comments
    const posts = await Post.find()
      .populate("author", "id fullName avatar")
      .populate("likes", "id fullName avatar")
      // .populate("comments", "id content author")
      .exec();

    res.status(200).json({ posts });
  }
);

// Like post
export const likePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.likes?.includes(req.user!._id)) {
      post.likes = post.likes?.filter(
        (userId) => userId.toString() !== req.user!._id.toString()
      );
    } else {
      post.likes?.push(req.user!._id);
    }

    await post.save();

    res.status(200).json({ post });
  }
);

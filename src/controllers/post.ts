import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Post from "../models/post";
import Image from "../models/image";
import { IUserDocument } from "../models/user";
import { cloudinary } from "../config/cloudinary";

type RequestWithUser = Request & { user: IUserDocument };

interface MulterRequest extends RequestWithUser {
  files?: Express.Multer.File[];
}

// Create post
// If create post is failed, the images will not be saved to the database
export const createPost = catchAsync(
  async (req: MulterRequest, res: Response, next: NextFunction) => {
    const { content } = req.body;

    if (!content) {
      if (req.files) {
        await Promise.all(
          req.files.map((file) => cloudinary.uploader.destroy(file.filename))
        );
      }
      return res.status(400).json({ message: "Please provide content" });
    }

    const urlImages = req.files?.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));

    const post = await Post.create({
      content,
      author: req.user.id,
      privacy: req.user.userSettings.postPrivacy,
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

    const deletedPost = await Post.findOneAndDelete({
      // ! In query, we have to use _id instead of id
      // ! because _id is the default field name of the id field in MongoDB
      _id: postId,
      // Only the author of the post can delete the post
      author: req.user._id,
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

// Get posts by userId
export const getPostsByUserId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate("images", "url")
      .populate("likes", "firstName surname fullName avatar")
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
      .populate("author", "firstName surname fullName avatar")
      .populate("images", "url")
      .populate("likes", "firstName surname fullName avatar")
      // .populate("comments", "id content author")
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

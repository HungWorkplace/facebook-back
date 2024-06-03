import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Comment from "../models/comment";
import { IUserDocument } from "../models/user";

type RequestWithUser = Request & { user: IUserDocument };

// Create comment
export const createComment = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Please provide content" });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
    });

    res.status(201).json({ comment });
  }
);

// like comment
export const likeComment = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user has already liked the comment, if so, remove the like
    // Otherwise, add the like
    if (comment.likes?.includes(req.user._id)) {
      comment.likes = comment.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      comment.likes?.push(req.user._id);
    }

    await comment.save();

    res.status(200).json({ comment });
  }
);

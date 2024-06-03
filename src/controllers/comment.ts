import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Comment from "../models/comment";

// Create comment
export const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { postId, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Please provide content" });
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user!._id,
    });

    res.status(201).json({ comment });
  }
);

// Delete comment
export const deleteComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const deletedComment = await Comment.findOneAndDelete({
      _id: commentId,
      author: req.user!._id,
    });

    if (!deletedComment) {
      return res
        .status(403)
        .json({ message: "There is no permission to delete this comment" });
    }

    res.status(204).json({});
  }
);

import { Router } from "express";
import * as postController from "../controllers/post";
import * as postCommentController from "../controllers/postComment";
import * as authController from "../controllers/auth";
import upload from "../middlewares/multer";

const postRouter = Router();

// create post, get posts in news feed, get my posts
postRouter
  .route("/")
  .get(authController.protect, postController.getPostsInNewsFeed)
  .post(
    authController.protect,
    upload.array("images"),
    postController.createPost
  );

postRouter
  .route("/users/:userId")
  .get(authController.protect, postController.getPostsByUserId);

postRouter.route("/me").get(authController.protect, postController.getMyPosts);

// Interact with a post
postRouter
  .route("/:postId")
  .delete(authController.protect, postController.deletePost);

postRouter
  .route("/:postId/like")
  .patch(authController.protect, postController.likePost);

// Comments
postRouter
  .route("/:postId/comments")
  .get(postCommentController.getCommentsByPostId)
  .post(authController.protect, postCommentController.createComment);

postRouter
  .route("/comments/:commentId/like")
  .patch(authController.protect, postCommentController.likeComment);

postRouter
  .route("/:postId/comments/:commentId")
  .delete(authController.protect, postCommentController.deleteComment);

export default postRouter;

import { Router } from "express";
import * as postController from "../controllers/post";
import * as postCommentController from "../controllers/postComment";
import * as authController from "../controllers/auth";
import upload from "../middlewares/multer";

const postRouter = Router();

// All request has req.user
postRouter.use(authController.protect);

// create post, get posts in news feed, get my posts
postRouter
  .route("/")
  .post(upload.array("images"), postController.createPost)
  .get(postController.getPostsInNewsFeed);

postRouter.route("/me").get(postController.getMyPosts);

// Interact with a post
postRouter.route("/:postId").delete(postController.deletePost);

postRouter.route("/:postId/like").patch(postController.likePost);

// Comments
postRouter.route("/:postId/comments").post(postCommentController.createComment);

postRouter
  .route("/comments/:commentId/like")
  .post(postCommentController.likeComment);

postRouter
  .route("/:postId/comments/:commentId")
  .delete(postCommentController.deleteComment);

export default postRouter;

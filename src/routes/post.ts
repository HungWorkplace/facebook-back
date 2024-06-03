import { Router } from "express";
import * as postController from "../controllers/post";
import * as authController from "../controllers/auth";
import upload from "../middlewares/multer";

const postRouter = Router();

postRouter.get("/", postController.getPosts);

postRouter.post(
  "/",
  authController.protect,
  upload.array("images"),
  postController.createPost
);

postRouter.delete(
  "/:postId",
  authController.protect,
  postController.deletePost
);

postRouter.patch(
  "/:postId/like",
  authController.protect,
  postController.likePost
);

export default postRouter;

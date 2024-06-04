import { Router } from "express";
import * as postController from "../controllers/post";
import * as userController from "../controllers/user";
import * as authController from "../controllers/auth";
import upload from "../middlewares/multer";

const userRouter = Router();

userRouter.route("/me").get(authController.protect, userController.getMe);

// get user by id
userRouter.route("/:userId").get(userController.getUserById);

// Update user info: avatar
userRouter
  .route("/avatar")
  .post(
    authController.protect,
    upload.single("avatar"),
    userController.uploadAvatar
  );

//   Get all posts of a user
userRouter.route("/:userId/posts").get(postController.getPostsByUserId);

export default userRouter;

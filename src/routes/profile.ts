import express from "express";
import * as profileController from "../controllers/profile";
import * as authController from "../controllers/auth";
import upload from "../middlewares/multer";

const profileRouter = express.Router();

profileRouter.get(
  "/",
  authController.userRequest,
  profileController.getProfile
);

profileRouter.post(
  "/upload/avatar",
  authController.protect,
  upload.single("avatar"),
  profileController.uploadAvatar
);

export default profileRouter;

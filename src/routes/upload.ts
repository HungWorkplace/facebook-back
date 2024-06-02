import { Router } from "express";
import multer from "multer";
import { storage } from "../config/cloudinary";
import * as uploadController from "../controllers/upload";

// Please store the file in cloudinary
const upload = multer({ storage });

const imageRouter = Router();

imageRouter.post(
  "/avatar",
  upload.single("image"),
  uploadController.uploadAvatar
);

export default imageRouter;

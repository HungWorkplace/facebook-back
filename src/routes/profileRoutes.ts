import express from "express";
import * as profileController from "../controllers/profileController";
import * as authController from "../controllers/authController";

const router = express.Router();

router.get("/", authController.userRequest, profileController.getProfile);

export default router;

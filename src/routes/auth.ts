import express from "express";
import * as authController from "../controllers/auth";

const router = express.Router();

router.post("/login", authController.login);

router.post("/signup", authController.signup);

router.get("/logout", authController.logout);

export default router;

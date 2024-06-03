import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/database";
import dotenv from "dotenv";
dotenv.config();

import authRouters from "./routes/auth";
import profileRouters from "./routes/profile";
import errorController from "./controllers/error";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Connect to MongoDB
connectDB();

// Parser middleware
app.use(bodyParser.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome!");
});

app.use("/auth", authRouters);
app.use("/profile", profileRouters);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

// 404 route
app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Resource not found!");
});

app.use(errorController);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

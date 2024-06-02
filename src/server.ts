import express, { type Request, type Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/database";
import dotenv from "dotenv";
dotenv.config();

import authRouters from "./routes/authRoutes";
import profileRouters from "./routes/profileRoutes";
import imageRouter from "./routes/upload";

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
app.use("/api/upload", imageRouter);

// 404 route
app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Resource not found!");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

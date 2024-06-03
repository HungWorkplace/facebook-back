import { Schema, model } from "mongoose";
import type { Privacy } from "../types/declaration";

interface IPost {
  content: string;
  author: Schema.Types.ObjectId;
  privacy: Privacy;
  images?: string[];
  likes?: Schema.Types.ObjectId[];
  comments?: Schema.Types.ObjectId[];
  createdAt?: Date;
}

export type IPostDocument = IPost & Document;

const postSchema = new Schema<IPost>({
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide author"],
  },
  images: [
    {
      type: Schema.ObjectId,
      ref: "Image",
    },
  ],
  privacy: {
    type: String,
    enum: ["public", "private"],
    required: [true, "Please provide privacy"],
  },
  likes: [
    {
      type: Schema.ObjectId,
      ref: "User",
    },
  ],
  comments: [
    {
      type: Schema.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = model<IPost>("Post", postSchema);
export default Post;

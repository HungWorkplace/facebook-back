import { Schema, model } from "mongoose";

interface IPost {
  content: string;
  author: Schema.Types.ObjectId;
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
  images: [String],
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

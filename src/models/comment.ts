import { Schema, model } from "mongoose";

interface IComment {
  content: string;
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  likes?: Schema.Types.ObjectId[];
  createdAt?: Date;
}

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: [true, "Please provide content"],
  },
  author: {
    type: Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide author"],
  },
  post: {
    type: Schema.ObjectId,
    ref: "Post",
    required: [true, "Please provide post"],
  },
  likes: [
    {
      type: Schema.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = model<IComment>("Comment", commentSchema);
export default Comment;

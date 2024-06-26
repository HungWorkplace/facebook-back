import { Schema, model } from "mongoose";

export interface IImage {
  url: string;
  publicId: string;
  author: Schema.Types.ObjectId;
  isSuggested?: boolean;
  post?: Schema.Types.ObjectId;
  createdAt?: Date;
}

const imageSchema = new Schema({
  url: {
    type: String,
    required: [true, "Please provide an image url"],
  },
  publicId: {
    type: String,
    required: [true, "Please provide an image publicId"],
  },
  isSuggested: Boolean,
  // Image can be used in User avatar or Post + images
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide an authorId"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = model<IImage>("Image", imageSchema);
export default Image;

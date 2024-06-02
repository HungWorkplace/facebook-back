import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      dbName:
        process.env.NODE_ENV === "development"
          ? "facebook-dev"
          : "facebook-prod",
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;

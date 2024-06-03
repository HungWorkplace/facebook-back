import multer from "multer";
import { storage } from "../config/cloudinary";

// We can store the file in cloudinary, memory, or disk
const upload = multer({ storage });

export default upload;

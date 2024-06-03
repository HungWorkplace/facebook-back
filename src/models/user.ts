import mongoose, { Types, Document, Schema, Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface IUser {
  firstName: string;
  surname: string;
  phone: string;
  email: string;
  password: string;
  birthday: Date;
  gender: "male" | "female" | "other";
  avatar?: string;
  createdAt?: Date;
  friends?: string[];
}

interface IUserMethods {
  comparePassword: (password: string, userPassword: string) => Promise<boolean>;
  generateToken: () => string;
}

// use many places
export interface IUserDocument extends IUser, IUserMethods, Document {}

type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide your first name"],
    },
    surname: { type: String, required: [true, "Please provide your surname"] },
    phone: { type: String },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Please provide your password"],
      // default: { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 }

      /**Must be at least 8 characters long.
       *Must contain at least 1 lowercase letter.
       *Must contain at least 1 uppercase letter.
       *Must contain at least 1 number.
       *Must contain at least 1 special character."
       */
      validate: [validator.isStrongPassword, "Password is not strong enough"],
    },
    birthday: {
      type: Date,
      required: [true, "Please provide your birthday"],
      validate: {
        validator: function (value: Date) {
          return validator.isBefore(
            value.toISOString(),
            new Date().toISOString()
          );
        },
        message: "Birthday must be in the past",
      },
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is missing"],
    },
    createdAt: { type: Date, default: Date.now },
    avatar: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// # Virtual property
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.surname}`;
});

// # Middleware
// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.model<IUser, UserModel>("User", userSchema);
export default User;

import mongoose, { ObjectId } from "mongoose";

export interface MessageInterface extends mongoose.Document {
  content: string;
  createdAt: Date;
}

// MONGOOSE.SCHEMA === SCHEMA [WHEN WE IMPORT SCHEMA FROM MONGOOSE LIKE DOCUMENT above]
const messageSchema: mongoose.Schema<MessageInterface> = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export interface UserInterface extends mongoose.Document {
  email: string;
  userName: string;
  password: string;
  verificationCode: string;
  verificationCodeExpiration: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: MessageInterface[];
}

const userSchema = new mongoose.Schema<UserInterface>(
  {
    email: {
      type: String,
      required: [true, "email field is required"],
      unique: true,
    },
    userName: {
      type: String,
      required: [true, "username field is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password field is required"],
    },
    verificationCode: {
      type: String,
      required: [true, "verification code field is required"],
    },
    verificationCodeExpiration: {
      type: Date,
      required: [true, "verificationCodeExpiration field is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<UserInterface>) ||
  mongoose.model<UserInterface>("User", userSchema);

export default User;

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "default.jpg",
    },
    refreshToken: {
      type: String,
    },
  },

  { timestamps: true } // createdAt, updatedAt
);

const userDB = mongoose.connection.useDb("users");
const User = userDB.model("User", UserSchema);

export default User;

import mongoose from "mongoose";

const ForgotPasswordSchema = new mongoose.Schema(
  {
    email: String,
    code: String,
    passwdResetCount: Number,
    usedCode: Boolean,
  },
  { timestamps: true }
); // createdAt, updatedAt;

const ForgotPassword = mongoose.model("ForgotPassword", ForgotPasswordSchema);

export default ForgotPassword;

import crypto from "crypto";

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import User from "./user.interface";

const UserSchema = new Schema<User>({
  first_name: {
    type: String,
    required: [true, "first name is required"],
    trim: true,
  },
  last_name: {
    type: String,
    required: [true, "last name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    trim: true,
    minLength: [6, "password must be at least 6 characters"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
      "must contain at least one number and one uppercase and lowercase letter",
    ],
    select: false,
  },
  password_confirmation: {
    type: String,
    required: [true, "password confirmation is required"],
    trim: true,
    minLength: [6, "password confirmation must be at least 6 characters"],
  },
  verification_code: String,
  activate: {
    type: Boolean,
    default: false,
  },
  changed_at: Date,
  password_reset_expires_at: Date,
  password_reset_token: String,
  verification_code_expires_in: Date,
});

//validate the password confirmation
UserSchema.path("password_confirmation").validate(function (val: string) {
  return this.password === val;
}, "password doesn't match");

//hash the password pre save
UserSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
  this.password_confirmation = undefined;

  next();
});

//methods

UserSchema.methods.verificationCodeExpireDate = function () {
  this.verification_code_expires_in = Date.now() + 2 * 60 * 1000;
};

//validate the password

UserSchema.methods.validatePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

//password reset token

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.password_reset_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.password_reset_expires_at = Date.now() + 10 * 60 * 1000; //expires in 10 mins

  return resetToken;
};

export default model<User>("User", UserSchema);

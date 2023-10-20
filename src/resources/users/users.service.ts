import bcrypt from "bcrypt";
import HttpException from "../../utils/http.exceptions";
import { createToken } from "../../utils/token";
import UserModel from "../users/users.model";
import User from "./users.interface";
import Token from "utils/interfaces/token.interface";
import generateRandomNumberString from "../../utils/generateCode";

import sendEmail from "../../utils/email";
class UserService {
  private user = UserModel;

  //registration
  public async register(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    await this.user.create({
      first_name,
      last_name,
      email,
      password,
      password_confirmation,
    });
  }

  //login
  public async login(email: string, password: string): Promise<void | string> {
    const user = await this.user
      .findOne({
        email,
      })
      .select("+password");
    if (!user) {
      throw new HttpException("User not found", 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpException("Invalid credentials", 401);
    }

    if (!user.activate) {
      const verificationCode = generateRandomNumberString();
      user.verification_code = verificationCode;
      user.verification_code_expires_in = Date.now() + 5 * 60 * 1000;
      await sendEmail({
        to: email,
        subject: "Verification Code",
        message: `Your verification code is ${verificationCode}, please note that the code will expire in 5 minutes`,
      });

      await user.save({ validateBeforeSave: false });
    } else {
      user.verification_code = undefined;
      await user.save({ validateBeforeSave: false });

      const accessToken = createToken(user);
      return accessToken;
    }
  }

  //send verification code
  public async sendVerificationCode(email: string): Promise<string> {
    const existUser = await this.user.findOne({
      verification_code_expires_in: { $gt: Date.now() },
      email,
    });

    if (!existUser) {
      throw new HttpException("no user exist or OTP has been expired", 404);
    }

    if (existUser.activate) {
      throw new HttpException("the email already activate", 400);
    }

    existUser.activate = true;
    await existUser.save({ validateBeforeSave: false });

    const accessToken = createToken(existUser);
    return accessToken;
  }
  //forgot password
  public async forgotPassword(
    email: string
  ): Promise<{ resetPasswordToken: string; user: User }> {
    const user = await this.user.findOne({ email });
    if (!user) {
      throw new HttpException("Invalid credentials", 401);
    }
    const resetPasswordToken = user.getResetPasswordToken();

    return {
      resetPasswordToken,
      user,
    };
  }

  //reset password
  public async resetPassword(
    password: string,
    password_confirmation: string,
    hashedToken: string
  ): Promise<string> {
    const user = await this.user.findOne({
      password_reset_token: hashedToken,
      password_reset_expires_at: { $gt: Date.now() },
    });
    if (!user) {
      throw new HttpException("Token is invalid or has expired", 400);
    }

    user.password = password;
    user.password_confirmation = password_confirmation;
    user.password_reset_expires_at = undefined;
    user.password_reset_token = undefined;
    await user.save();

    const token = createToken(user);
    return token;
  }
}

export default UserService;

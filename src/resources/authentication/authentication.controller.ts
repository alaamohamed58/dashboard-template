import crypto from "crypto";
import { NextFunction, Request, Response, Router } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Controller from "../../utils/interfaces/controller.interface";
import AuthenticationService from "./authentication.service";

import HttpException from "../../utils/http.exceptions";

interface CookieOption {
  expires: Date;
  httpOnly: boolean;
  secure?: boolean;
}

class AuthenticationUser implements Controller {
  public path = "/user";
  public router = Router();

  private service = new AuthenticationService();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes(): void {
    this.router.post(`${this.path}/register`, this.signUp);
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(`${this.path}/forgotPassword`, this.forgetPassword);
    this.router.post(`${this.path}/resetPassword/:token`, this.resetPassword);
    this.router.post(`${this.path}/verify-email`, this.verifyEmail);
  }

  //sign up
  private signUp = asyncHandler(
    async (req: Request, res: Response): Promise<Response | void> => {
      const { first_name, last_name, email, password, password_confirmation } =
        req.body;

      await this.service.register(
        first_name,
        last_name,
        email,
        password,
        password_confirmation
      );

      res.status(201).json({
        message: "Email created successfully",
      });
    }
  );

  //verification code
  private verifyEmail = asyncHandler(
    async (req: Request, res: Response): Promise<Response | void> => {
      const { email } = req.body;

      const token = await this.service.sendVerificationCode(email);

      const options: CookieOption = {
        expires: new Date(
          Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      if (process.env.NODE_ENV === "production") options.secure = true;
      res.cookie("dashboard-jwt", token, options);

      res.status(200).json({
        message: "Email Activated successfully",
        accessToken: token,
      });
    }
  );

  //login
  private login = asyncHandler(
    async (req: Request, res: Response): Promise<Response | void> => {
      const { email, password } = req.body;

      const token = await this.service.login(email, password);

      const options: CookieOption = {
        expires: new Date(
          Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      if (process.env.NODE_ENV === "production") options.secure = true;
      res.cookie("dashboard-jwt", token, options);
      let responseObj = {};

      if (token) {
        responseObj = {
          message: "succesfully logged in",
          accessToken: token,
        };
      } else {
        responseObj = {
          message: "OTP send",
        };
      }

      res.status(200).json(responseObj);
    }
  );

  //forget password
  private forgetPassword = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const { email } = req.body;

      const { user, resetPasswordToken } = await this.service.forgotPassword(
        email
      );

      await user.save({ validateBeforeSave: false });

      try {
        const resetURL = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/user/resetPassword/${resetPasswordToken}`;

        await email({
          to: user.email,
          subject: "Reset Password",
          message: `Forgot your password ? Submit this link to set new password : ${resetURL}`,
        });
        res.status(200).json({
          message: "token sent to email",
        });
      } catch (err) {
        console.log(err);
        user.password_reset_token = undefined;
        user.password_reset_expires_at = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
          new HttpException(
            "there was an error sending an email, please try later" + err,
            500
          )
        );
      }
    }
  );

  //reset password
  private resetPassword = asyncHandler(
    async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<Response | void> => {
      const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
      const { password, password_confirmation } = req.body;
      const token = await this.service.resetPassword(
        password,
        password_confirmation,
        hashedToken
      );
      res.status(200).json({
        message: "Password reset successfully",
        accessToken: token,
      });
    }
  );
}

export default AuthenticationUser;

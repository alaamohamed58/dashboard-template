import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Token from "../utils/interfaces/token.interface";
import token from "../utils/token";

import HttpException from "../utils/http.exceptions";
import usersModel from "../resources/users/user.model";

async function protectMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let accessToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  } else if (req.cookies["dashboard-jwt"]) {
    accessToken = req.cookies["dashboard-jwt"];
  }

  if (!accessToken) {
    return next(new HttpException("You are not authenticated", 401));
  }

  const payload: Token | jwt.JsonWebTokenError = await token.verifyToken(
    accessToken
  );
  if (payload instanceof jwt.JsonWebTokenError) {
    return next(new HttpException("invalid token", 400));
  }
  const user = await usersModel.findById(payload.user._id);

  req.user = user;

  next();
}

export default protectMiddleware;

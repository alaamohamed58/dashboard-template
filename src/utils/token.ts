import { Response } from "express";

import jwt from "jsonwebtoken";
import User from "resources/users/users.interface";
import Token from "./interfaces/token.interface";

export const createToken = (user: User) => {
  const currentUser = {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
  };

  return jwt.sign({ currentUser }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const verifyToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload as Token);
      }
    });
  });
};

export default {
  createToken,
  verifyToken,
};

import { NextFunction, Request, Response } from "express";
import HttpException from "../utils/http.exceptions";

//dublicate key
function dublicateKey(error: any) {
  const message = `Dublicate field value entered : ${Object.values(
    error.keyValue
  )}`;
  return new HttpException(message, 400);
}

//unauthorized
function unauthorized(error: any) {
  const message = "You are not authorized";
  return new HttpException(message, 401);
}

function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let error = { ...err };
  console.log(error);
  if (error.code === 11000) error = dublicateKey(error);
  if (error.statusCode === 401) error = unauthorized(error);

  const statusCode = error.statusCode || 500;
  const message = error.message || "Something went wrong!";
  res.status(statusCode).json({
    statusCode,
    message,
  });
}

export default errorMiddleware;

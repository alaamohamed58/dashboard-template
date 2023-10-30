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

function devError(err: any, res: Response) {
  res.status(err.statusCode).json({
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
    error: err,
  });
}

const sendErrorProd = (err: any, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error("ERROR 💥", err);

    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "error";

  if (process.env.NODE_ENV === "development") {
    devError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = dublicateKey(error);
    if (error.name === "ValidationError") console.log(error.name);
    if (error.statusCode === 401) error = unauthorized(error);

    sendErrorProd(error, res);
  }
}

export default errorMiddleware;

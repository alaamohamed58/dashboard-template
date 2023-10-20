import { NextFunction, Request, Response } from "express";

type fn = (req: Request, res: Response, next: NextFunction) => {};

const asyncHandler =
  (fn: fn) => (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;

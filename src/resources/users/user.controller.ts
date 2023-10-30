import { Router, Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import Controller from "../../utils/interfaces/controller.interface";
import UserService from "./user.service";
import protectMiddleware from "../../middleware/protect.middleware";

class UserController implements Controller {
  public path = "/user";
  public router = Router();

  private userService = new UserService();

  constructor() {
    this.intializeRoutes();
  }

  private intializeRoutes(): void {
    this.router.get(`${this.path}`, protectMiddleware, this.getAllUsrs);
  }

  private getAllUsrs = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const users = await this.userService.getAllUsers();

      console.log(req.user);

      res.status(200).json({
        count: users.length,
        results: {
          data: users,
        },
      });
    }
  );
}

export default UserController;

import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";
import Team from "./social.interface";
import SocialService from "./social.service";
import protectMiddleware from "../../middleware/protect.middleware";

class SocialController implements Controller {
  public router = Router();
  public path = "/social";

  private socialService = new SocialService();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post(this.path, protectMiddleware, this.createSocial);

    this.router.get(this.path, protectMiddleware, this.getSocial);
    this.router.patch(`${this.path}/:id`, protectMiddleware, this.updateSocial);
    this.router.delete(
      `${this.path}/:id`,
      protectMiddleware,
      this.deleteSocial
    );
  }

  private createSocial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const social = await this.socialService.createSocial(req);

      res.status(201).json({
        message: "Succesfully created",
        results: {
          data: social,
        },
      });
    }
  );
  private getSocial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const socials = await this.socialService.getSocial();

      res.status(200).json({
        results: {
          data: socials,
        },
      });
    }
  );

  private deleteSocial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const socials = await this.socialService.deleteSocial(req);

      res.status(204).json({
        message: "Succesfully Deleted",
        results: null,
      });
    }
  );

  private updateSocial = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const socials = await this.socialService.updateSocial(req);

      res.status(200).json({
        message: "Succesfully Updated",
        results: {
          data: socials,
        },
      });
    }
  );
}

export default SocialController;

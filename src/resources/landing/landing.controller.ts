import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";
import LandingService, { uploadLanding } from "./landing.service";
import protectMiddleware from "../../middleware/protect.middleware";

class LandingController implements Controller {
  public router = Router();
  public path = "/landing";

  private landingService = new LandingService();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post(
      this.path,
      protectMiddleware,
      uploadLanding,
      this.createLanding
    );

    this.router.get(this.path, protectMiddleware, this.getLanding);
    this.router.delete(
      `${this.path}/:id`,
      protectMiddleware,
      this.deleteLanding
    );
    this.router.patch(
      `${this.path}/:id`,
      protectMiddleware,
      uploadLanding,
      this.updateLanding
    );
  }

  private createLanding = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const landing = await this.landingService.createLanding(req);

      res.status(201).json({
        message: "Succesfully created",
        results: {
          data: landing,
        },
      });
    }
  );
  private getLanding = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const landing = await this.landingService.getLanding();

      res.status(200).json({
        results: {
          data: landing,
        },
      });
    }
  );

  private updateLanding = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const landing = await this.landingService.updateLanding(req);

      res.status(200).json({
        message: "Succesfully Updated",
        results: {
          data: landing,
        },
      });
    }
  );

  private deleteLanding = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.landingService.deleteLanding(req);

      res.status(204).json({
        message: "Succesfully Deleted",
        results: null,
      });
    }
  );
}

export default LandingController;

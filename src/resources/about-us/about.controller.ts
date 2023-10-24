import { Request, Response, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";
import AboutService from "./about.service";

class AboutController implements Controller {
  public router = Router();
  public path = "/about";

  private aboutService = new AboutService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.createAbout);
    this.router.get(this.path, this.getAbout);
    this.router.delete(`${this.path}/:id`, this.deleteAbout);
    this.router.patch(`${this.path}/:id`, this.updateAbout);
  }

  private createAbout = asyncHandler(async (req: Request, res: Response) => {
    const about = await this.aboutService.createAbout(req);

    res.status(201).json({
      message: "Succesfully created",
      results: {
        data: about,
      },
    });
  });

  private getAbout = asyncHandler(async (req: Request, res: Response) => {
    const about = await this.aboutService.getAbout();

    res.status(200).json({
      results: {
        data: about,
      },
    });
  });

  private deleteAbout = asyncHandler(async (req: Request, res: Response) => {
    const about = await this.aboutService.deleteAbout();

    res.status(204).json({
      message: "Succesfully Delete",
      results: null,
    });
  });

  private updateAbout = asyncHandler(async (req: Request, res: Response) => {
    const about = await this.aboutService.updateAbout(req);

    res.status(200).json({
      message: "Succesfully Updated",
      results: {
        data: about,
      },
    });
  });
}

export default AboutController;

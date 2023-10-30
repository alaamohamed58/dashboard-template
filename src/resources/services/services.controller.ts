import { Request, Response,  Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";
import Services from "./services.service";

class ServiceController implements Controller {
  public path = "/service";
  public router = Router();

  private service = new Services();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.createService);
    this.router.get(this.path, this.getServices);
    this.router.delete(`${this.path}/:id`, this.deleteService);
    this.router.patch(`${this.path}/:id`, this.updateService);
  }

  private createService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.service.createService(req);

    res.status(201).json({
      message: "Succesfully created",
      results: {
        data: service,
      },
    });
  });

  private getServices = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.service.getServices();

    res.status(200).json({
      results: {
        data: service,
      },
    });
  });

  private deleteService = asyncHandler(async (req: Request, res: Response) => {
    await this.service.deleteService(req);

    res.status(204).json({
      message: "Succesfully Delete",
      results: null,
    });
  });

  private updateService = asyncHandler(async (req: Request, res: Response) => {
    const service = await this.service.updateServices(req);

    res.status(200).json({
      message: "Succesfully Updated",
      results: {
        data: service,
      },
    });
  });
}

export default ServiceController;

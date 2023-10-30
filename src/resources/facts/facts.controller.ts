import { NextFunction, Request, Response, Router } from "express";
import { Document } from "mongoose";

import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";
import FactService from "./facts.service";
import protectMiddleware from "../../middleware/protect.middleware";

class FactController implements Controller {
  public path = "/facts";
  public router = Router();

  private factService = new FactService();

  constructor() {
    this.inititalizeRoutes();
  }

  private inititalizeRoutes() {
    this.router.post(this.path, protectMiddleware, this.createFact);
    this.router.get(this.path, this.getFacts);
    this.router.delete(`${this.path}/:id`, protectMiddleware, this.deleteFact);

    this.router.patch(`${this.path}/:id`, this.updatefact);
  }

  //create new fact
  private createFact = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { fact_name, fact_number } = req.body;

      const newFact = await this.factService.createFact(fact_name, fact_number);

      res.status(201).json({
        message: "Successfully created",
        newFact,
      });
    }
  );

  //get all facts
  private getFacts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const allFacts: Document[] | void = await this.factService.getAllFacts(
        req
      );

      res.status(200).json({
        count: allFacts && allFacts.length,
        data: {
          facts: allFacts,
        },
      });
    }
  );

  //update fact
  private updatefact = asyncHandler(
    async (req: Request, res: Response, next) => {
      const updatedFact = await this.factService.updateFact(req);

      res.status(200).json({
        message: "Successfully updated",
        updatedFact,
      });
    }
  );

  //delete fact
  private deleteFact = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      await this.factService.deleteFact(req.params.id);

      res.status(204).json({
        message: "Successfully deleted",
      });
    }
  );
}

export default FactController;

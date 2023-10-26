import { Document } from "mongoose";
import { Request } from "express";
import factsModel from "./facts.model";
import Fact from "./facts.interface";
import HttpException from "../../utils/http.exceptions";

class FactService {
  private factsModel = factsModel;

  //create fact
  public async createFact(
    fact_name: string,
    fact_number: string
  ): Promise<Fact> {
    const newFact = await this.factsModel.create({
      fact_name,
      fact_number,
    });

    return newFact;
  }

  //get all facts
  public async getAllFacts(req: Request): Promise<void | Document[]> {
    const facts = await this.factsModel.find();

    return facts;
  }

  //delete fact
  public async deleteFact(id: string): Promise<void | Error> {
    const deletedFact = await this.factsModel.findByIdAndDelete(id);

    if (!deletedFact) {
      throw new HttpException("Not Found", 404);
    }
  }

  //update fact
  public async updateFact(req: Request): Promise<Document | Error> {
    const updatedFact = await this.factsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedFact) {
      throw new HttpException("No fact found to update", 400);
    }

    return updatedFact;
  }
}

export default FactService;

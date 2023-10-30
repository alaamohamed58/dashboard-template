import { Request } from "express";
import { Document } from "mongoose";
import servicesModel from "./services.model";
import ServiceInterface from "./services.interface";
import HttpException from "../../utils/http.exceptions";

class Services {
  private serviceModel = servicesModel;

  public async createService(req: Request): Promise<ServiceInterface> {
    const newService = await this.serviceModel.create(req.body);
    return newService;
  }
  public async getServices(): Promise<Document[]> {
    const services = await this.serviceModel.find();
    return services;
  }

  public async deleteService(req: Request): Promise<Error | void> {
    const service = await this.serviceModel.findByIdAndDelete(req.params.id);
    if (!service) {
      throw new HttpException("No Service with this id", 404);
    }
  }

  public async updateServices(req: Request): Promise<ServiceInterface | Error> {
    const service = await this.serviceModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      throw new HttpException("No Service with this id", 404);
    }
    return service;
  }
}


export default Services
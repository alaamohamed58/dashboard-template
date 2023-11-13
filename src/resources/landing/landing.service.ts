import { Request } from "express";

import { Document } from "mongoose";
import multer from "multer";

import landingModel from "./landing.model";
import Landing from "./landing.interface";
import HttpException from "../../utils/http.exceptions";
import { multerStorage, multerFilter } from "../../utils/multer";

const storage = multerStorage("landing");

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

export const uploadLanding = upload.single("photo");

class LandingService {
  private landingModel = landingModel;

  public async createLanding(req: Request): Promise<Landing> {
    await this.landingModel.deleteMany();

    const landing = await this.landingModel.create({
      heading: req.body.heading,
      text: req.body.text,
      photo: req.file?.filename,
    });

    return landing;
  }

  public async getLanding(): Promise<Document[]> {
    const landing = await this.landingModel.find();

    return landing;
  }

  public async deleteLanding(req: Request): Promise<void | Error> {
    const landing = await this.landingModel.findByIdAndDelete(req.params.id);
    if (!landing) {
      throw new HttpException("no landing with this id", 404);
    }
  }

  public async updateLanding(req: Request): Promise<Landing> {
    const landing = await this.landingModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!landing) {
      throw new HttpException("no landing with this id", 404);
    }

    return landing;
  }
}

export default LandingService;

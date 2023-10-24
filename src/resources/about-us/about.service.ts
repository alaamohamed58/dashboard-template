import { Document } from "mongoose";
import { Request } from "express";
import aboutModel from "./about.model";
import About from "./about.interface";
import HttpException from "../../utils/http.exceptions";

class AboutService {
  private about = aboutModel;

  public async createAbout(req: Request): Promise<About> {
    const about = await this.about.create(req.body);

    return about;
  }

  public async getAbout(): Promise<Document[]> {
    const about = await this.about.find();

    return about;
  }

  public async deleteAbout(): Promise<void | Error> {
    const about = await this.about.findByIdAndDelete();
    if (!about) {
      throw new HttpException("there is no document with that id", 404);
    }
  }

  public async updateAbout(req: Request): Promise<About | Error> {
    const about = await this.about.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!about) {
      throw new HttpException("there is no document with that id", 404);
    }

    return about;
  }
}

export default AboutService;

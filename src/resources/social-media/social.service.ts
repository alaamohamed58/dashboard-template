import { Request } from "express";
import { Document } from "mongoose";

import socialModel from "./social.model";
import HttpException from "../../utils/http.exceptions";
import Social from "./social.interface";

class SocialService {
  private social = socialModel;

  public async createSocial(req: any): Promise<Social> {
    const social = await this.social.create(req.body);

    return social;
  }

  public async getSocial(): Promise<Document[]> {
    const socials = await this.social.find();

    return socials;
  }

  public async deleteSocial(req: Request): Promise<void | Error> {
    const social = await this.social.findByIdAndDelete(req.params.id);

    if (!social) {
      throw new HttpException("there is no document with that id", 404);
    }
  }

  public async updateSocial(req: Request): Promise<Social | Error> {
    const social = await this.social.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!social) {
      throw new HttpException("there is no document with that id", 404);
    }

    return social;
  }
}

export default SocialService;

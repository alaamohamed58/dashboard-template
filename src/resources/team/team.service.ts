import { Request } from "express";
import { Document } from "mongoose";

import multer from "multer";
import teamModel from "./team.model";
import HttpException from "../../utils/http.exceptions";
import Team from "./team.interface";

interface CustomFile {
  mimetype: string;
}

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/team");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req: Request, file: CustomFile, cb: any) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new HttpException("Not an image! Please upload only images.", 400),
      false
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadTeamPhoto = upload.single("photo");

class TeamService {
  private team = teamModel;

  public async createTeam(req: any): Promise<Team> {
    const team = await this.team.create({
      photo: req.file.filename,
      ...req.body,
    });

    return team;
  }

  public async getTeam(): Promise<Document[]> {
    const teams = await this.team.find();
    return teams;
  }

  public async deleteTeam(req: Request): Promise<void | Error> {
    const team = await this.team.findByIdAndDelete(req.params.id);

    if (!team) {
      throw new HttpException("No document with this id", 404);
    }
  }

  public async updateTeam(req: Request): Promise<Team | Error> {
    const team = await this.team.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!team) {
      throw new HttpException("No document with this id", 404);
    }
    return team;
  }
}

export default TeamService;

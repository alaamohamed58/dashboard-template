import { Request } from "express";
import { Document, Types } from "mongoose";
import multer from "multer";
import { multerStorage, multerFilter } from "../../utils/multer";
import teamModel from "./team.model";
import HttpException from "../../utils/http.exceptions";
import Team from "./team.interface";

const storage = multerStorage("team");
const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

export const uploadTeamPhoto = upload.single("photo");

class TeamService {
  private team = teamModel;

  public async createTeam(req: any): Promise<Team> {
    let team: Document<unknown, {}, Team> &
      Team & {
        _id: Types.ObjectId;
      };
    if (req.file) {
      team = await this.team.create({
        photo: req.file.filename,
        ...req.body,
      });
    } else {
      team = await this.team.create(req.body);
    }
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

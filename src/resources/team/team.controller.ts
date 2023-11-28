import { NextFunction, Request, Response, Router } from "express";
import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";
import TeamService, { uploadTeamPhoto } from "./team.service";
import protectMiddleware from "../../middleware/protect.middleware";

class TeamController implements Controller {
  public router = Router();
  public path = "/team";

  private teamService = new TeamService();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter(): void {
    this.router.post(
      this.path,
      protectMiddleware,
    uploadTeamPhoto,
      this.createTeam
    );

    this.router.get(this.path, protectMiddleware, this.getTeam);
    this.router.delete(`${this.path}/:id`, protectMiddleware, this.deleteTeam);
    this.router.patch(
      `${this.path}/:id`,
      protectMiddleware,
      uploadTeamPhoto,
      this.updateTeam
    );
  }

  private createTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const team = await this.teamService.createTeam(req);
      const url = `${req.protocol}://${req.get("host")}/${
        req.file?.destination
      }/${req.file?.filename}`;

      team.imagePath = url;

      await team.save();
      res.status(201).json({
        message: "Succesfully created",
        results: {
          data: team,
        },
      });
    }
  );
  private getTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const team = await this.teamService.getTeam();

      res.status(200).json({
        results: {
          data: team,
        },
      });
    }
  );

  private updateTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const team = await this.teamService.updateTeam(req);

      res.status(200).json({
        message: "Succesfully Updated",
        results: {
          data: team,
        },
      });
    }
  );

  private deleteTeam = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      await this.teamService.deleteTeam(req);

      res.status(204).json({
        message: "Succesfully Deleted",
        results: null,
      });
    }
  );
}

export default TeamController;

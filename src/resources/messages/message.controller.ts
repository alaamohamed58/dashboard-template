import { Request, Response, Router } from "express";
import MessageService from "./message.service";

import Controller from "../../utils/interfaces/controller.interface";
import asyncHandler from "../../utils/asyncHandler";

class MessageController implements Controller {
  public path = "/message";
  public router = Router();

  private messageService = new MessageService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.sendMessage);
    this.router.get(this.path, this.getMessages);
    this.router.delete(`${this.path}/:id`, this.deleteMessage);
  }

  private sendMessage = asyncHandler(async (req: Request, res: Response) => {
    const message = await this.messageService.sendMessage(req);

    res.status(201).json({
      message: "Succesfully sent",
      results: {
        data: message,
      },
    });
  });

  private getMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await this.messageService.getMessages();

    res.status(200).json({
      results: {
        data: messages,
      },
    });
  });

  private deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    await this.messageService.deleteMessage(req);

    res.status(204).json({
      message: "Message Deleted",
      results: null,
    });
  });
}

export default MessageController;

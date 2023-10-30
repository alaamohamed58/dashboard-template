import { Document } from "mongoose";
import { Request } from "express";
import messageModel from "./message.model";
import HttpException from "../../utils/http.exceptions";

class MessageService {
  private messageModel = messageModel;

  public async sendMessage(req: Request): Promise<Document> {
    const newMessage = await this.messageModel.create(req.body);

    return newMessage;
  }

  public async getMessages(): Promise<Document[]> {
    const messages = await this.messageModel.find();

    return messages;
  }

  public async deleteMessage(req: Request): Promise<void | Error> {
    const message = await this.messageModel.findByIdAndDelete(req.params.id);

    if (!message) {
      throw new HttpException("no message with this id", 404);
    }
  }
}

export default MessageService;

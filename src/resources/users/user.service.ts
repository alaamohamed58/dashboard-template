import userModel from "./user.model";
import { Document } from "mongoose";

class UserService {
  private users = userModel;

  public async getAllUsers(): Promise<Document[]> {
    const users = this.users.find();

    return users;
  }
}

export default UserService;

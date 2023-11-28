import { Document } from "mongoose";

interface Team extends Document {
  name: string;
  email: string;
  role: string;
  summary: string;
  photo: string;
  imagePath: String,

}

export default Team;

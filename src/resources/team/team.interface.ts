import { Document } from "mongoose";

interface Team extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  summary: string;
  photo: string;
}

export default Team;

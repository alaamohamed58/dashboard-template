import { Schema, model } from "mongoose";
import Team from "./team.interface";

const teamSchema = new Schema({
  name: {
    type: String,
    required: [true, "team name is required"],
    trim: true,
  },
  email: String,
  phone: String,
  role: String,
  summary: String,
  photo: String,
});

export default model<Team>("Team", teamSchema);

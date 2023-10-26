import { Schema, model } from "mongoose";
import Landing from "./landing.interface";

const landingSchema = new Schema<Landing>({
  heading: String,
  text: String,
  photo: String,
});

export default model<Landing>("Landing", landingSchema);

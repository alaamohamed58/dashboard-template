import { Schema, model } from "mongoose";
import About from "./about.interface";

const aboutSchema = new Schema({
  about_us: {
    type: String,
    required: [true, "please insert about us text"],
    trim: true,
  },
});

export default model<About>("About", aboutSchema);

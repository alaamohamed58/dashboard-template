import { Schema, model } from "mongoose";
import Services from "./services.interface";

const serviceSchema = new Schema<Services>({
  service_title: {
    type: String,
    required: true,
    trim: true,
    minLength: [2, "Service title must be at least 2 characters"],
  },
  service_detail: {
    type: String,
    trim: true,
  },
});

export default model<Services>("Services", serviceSchema);

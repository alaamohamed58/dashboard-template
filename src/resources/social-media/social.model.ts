import { Schema, model } from "mongoose";
import Social from "./social.interface";

const socialSchema = new Schema<Social>({
  facebook: String,
  instagram: String,
  twitter: String,
  website: String,
  mail: String,
  phone_number: String,
});

export default model<Social>("Social", socialSchema);

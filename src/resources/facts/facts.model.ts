import { Schema, model } from "mongoose";
import Fact from "./facts.interface";

const factSchema = new Schema<Fact>({
  fact_name: {
    type: String,
    required: [true, "fact name is required"],
    trim: true,
    unique: true,
  },
  fact_number: {
    type: String,
    required: [true, "fact number is required"],
    trim: true,
  },
});

export default model<Fact>("Facts", factSchema);

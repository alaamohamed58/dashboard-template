import { Document } from "mongoose";

interface Fact extends Document {
  fact_name: string;
  fact_number: string;
}

export default Fact;

import { Document } from "mongoose";

interface About extends Document {
  about_us: string;
}

export default About

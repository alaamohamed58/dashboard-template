import { Document } from "mongoose";

interface Landing extends Document {
  heading: string;
  text: string;
  photo: string;
}

export default Landing;

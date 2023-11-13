import { Document } from "mongoose";

interface Landing extends Document {
  heading: string;
  text: string;
  photo: string;
  imagePath: string;
}

export default Landing;

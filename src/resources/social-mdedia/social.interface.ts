import { Document } from "mongoose";

interface Social extends Document {
  facebook: string;
  instagram: string;
  twitter: string;
  website: string;
  mail: string;
  phone_number: string;
}

export default Social;

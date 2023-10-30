import { Document } from "mongoose";

interface Services extends Document {
  service_title: string;
  service_detail: string;
}

export default Services

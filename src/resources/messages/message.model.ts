import { Schema, model } from "mongoose";
import Message from "./message.interface";

const messageSchema = new Schema<Message>({
  name: {
    type: String,
    required: [true, "please provide your name"],
    minlength: [2, "Your name must be at least 2 characters"],
  },
  phone: {
    type: String,
    required: [true, "please provide your phone numbe"],
    minlength: [11, "phone number must be at least 11 charac"],
  },
  email: String,
  message: {
    type: String,
    required: [true, "please provide your message"],
  },
});

export default model<Message>("Messages", messageSchema);

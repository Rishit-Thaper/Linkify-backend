import mongoose, { Schema } from "mongoose";
const linkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Link = mongoose.model("Link", linkSchema);

import mongoose, { Schema } from "mongoose";
const profileSchema = new Schema({
  bio: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Profile = mongoose.model("Profile", profileSchema);

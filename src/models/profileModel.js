import mongoose, { Schema } from "mongoose";
const profileSchema = new Schema({
  bio: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  birthdate: {
    type: Date,
    required: true,
  },
  profile_picture: {
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

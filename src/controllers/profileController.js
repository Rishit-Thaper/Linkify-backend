import { asyncHandler } from "../utils/asyncHandler.js";
import { Profile } from "../models/profileModel.js";
import { uploadOnCLoudinary } from "../utils/cloudinary.js";
import { User } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { ObjectId } from "mongodb";
// @desc    Get user profile
const getProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user_id: req.user._id });
  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }
  return res.status(200).json(new ApiResponse(200, profile, "Profile found"));
});

// @desc    Create user profile
const createProfile = asyncHandler(async (req, res) => {
  const { bio, dateOfBirth } = req.body;
  console.log(req.body);
  console.log(req.file);
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCLoudinary(avatarLocalPath);
  console.log(avatar.url);

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const profile = await Profile.create({
    bio,
    dateOfBirth,
    avatar: avatar.url,
    user_id: userId,
  });

  if (!profile) {
    throw new ApiError(400, "Profile not created");
  }

  return res.status(200).json(new ApiResponse(200, profile, "Profile Created"));
});

// @desc    Update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  console.log(avatarLocalPath);
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const avatar = await uploadOnCLoudinary(avatarLocalPath);
  const userId = req.user._id;
  const profile = await Profile.findOneAndUpdate(
    { user_id: userId },
    {
      avatar: avatar.url,
    },
    { new: true }
  );

  if (!profile) {
    throw new ApiError(400, "Avatar not updated");
  }

  return res.status(200).json(new ApiResponse(200, profile, "Avatar Updated"));
});
// @desc    Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { bio, dateOfBirth } = req.body;
  console.log(req.body);

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const profile = await Profile.findOneAndUpdate(
    { user_id: userId },
    {
      bio,
      dateOfBirth,
    },
    { new: true }
  );

  if (!profile) {
    throw new ApiError(400, "Profile not updated");
  }

  return res.status(200).json(new ApiResponse(200, profile, "Profile Updated"));
});

// @desc getCompleteProfile with Links
const getCompleteProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  const profile = await Profile.aggregate([
    {
      $match: {
        user_id: userId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $lookup: {
        from: "links",
        localField: "user_id",
        foreignField: "user_id",
        as: "links",
      },
    },
  ]);

  console.log(profile);

  if (!profile) {
    throw new ApiError(400, "Invalid ID");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User's Complete Profile"));
});

const getCompletePublicProfile = asyncHandler(async (req, res) => {
  const userId = String(req.params.id);
  const objectId = new ObjectId(userId);
  console.log(objectId);
  const profile = await Profile.aggregate([
    {
      $match: {
        user_id: objectId,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "users",
      },
    },
    {
      $lookup: {
        from: "links",
        localField: "user_id",
        foreignField: "user_id",
        as: "links",
      },
    },
  ]);

  console.log(profile);

  if (!profile) {
    throw new ApiError(400, "Invalid ID");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User's Complete Profile"));
});
export {
  getProfile,
  createProfile,
  updateProfile,
  updateUserAvatar,
  getCompleteProfile,
  getCompletePublicProfile,
};

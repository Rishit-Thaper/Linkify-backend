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
    return res.status(400).json(new ApiError(400, "Profile not found"));
  }
  return res.status(200).json(new ApiResponse(200, profile, "Profile found"));
});

// @desc    Create user profile
const createProfile = asyncHandler(async (req, res) => {
  const { bio, dateOfBirth } = req.body;
  console.log(req.body);
  console.log(req.file);
  const avatarLocalPath = req.file?.path;
  console.log("Local Path", avatarLocalPath);
  if (!avatarLocalPath) {
    return res.status(400).json(new ApiError(400, "Avatar is required"));
  }
  const avatar = await uploadOnCLoudinary(avatarLocalPath);
  console.log(avatar.url);

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json(new ApiError(400, "User not found"));
  }

  const profile = await Profile.create({
    bio,
    dateOfBirth,
    avatar: avatar.url,
    user_id: userId,
  });

  if (!profile) {
    return res.status(400).json(new ApiError(400, "Profile not created"));
  }

  return res.status(200).json(new ApiResponse(200, profile, "Profile Created"));
});

// @desc    Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { bio, dateOfBirth } = req.body;
  const avatarLocalPath = req.file?.path;
  console.log("Request", req.body);
  console.log("avatar", avatarLocalPath);
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json(new ApiError(400, "User not found"));
  }

  let updatedFields = {};
  if (avatarLocalPath) {
    const avatar = await uploadOnCLoudinary(avatarLocalPath);
    updatedFields.avatar = avatar.url;
  }
  if (bio !== undefined) {
    updatedFields.bio = bio;
  }
  if (dateOfBirth !== undefined) {
    updatedFields.dateOfBirth = dateOfBirth;
  }
  console.log("updated", updatedFields);
  const profile = await Profile.findOneAndUpdate(
    { user_id: userId },
    updatedFields,
    { new: true }
  );

  if (!profile) {
    return res.status(400).json(new ApiError(400, "Profile not updated"));
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
    return res.status(400).json(new ApiError(400, "Invalid UserID"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User's Complete Profile"));
});

// @desc getCompletePublicProfile with Links
const getCompletePublicProfile = asyncHandler(async (req, res) => {
  const username = req.params.username;
  const profile = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user_id",
        as: "profile",
      },
    },
    {
      $lookup: {
        from: "links",
        localField: "_id",
        foreignField: "user_id",
        as: "links",
      },
    },
  ]);

  console.log(profile);

  if (!profile) {
    return res.status(400).json(new ApiError(400, "Invalid User"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, profile, "User's Complete Profile"));
});

export {
  getProfile,
  createProfile,
  updateProfile,
  getCompleteProfile,
  getCompletePublicProfile,
};

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";

const generateToken = async (user_id) => {
  try {
    if (!user_id) {
      return res.status(400).json(new ApiError(400, "User ID is required"));
    }
    const user = await User.findById(user_id);

    if (!user) {
      return res.status(400).json(new ApiError(400, "User don't exist"));
    }
    const token = await user.generateAccessToken();
    return token;
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while generating token"));
  }
};

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);

  if ([email, username, password].some((field) => field?.trim() === "")) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }
  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    return res.status(400).json(new ApiError(400, "Username Already taken"));
  }
  
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User Already exists"));
  }

  const createdUser = await User.create({ email, username, password });

  if (!createdUser) {
    return res
      .status(500)
      .json(
        new ApiError(500, "Something went wrong while creating user account")
      );
  }
  const newUser = await User.findById(createdUser._id).select("-password");
  const accessToken = await generateToken(createdUser._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: newUser,
        accessToken,
      },
      "User Successfully Created"
    )
  );
});

// @desc    Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(400).json(new ApiError(400, "User not found"));
  }

  const matchPassword = await existingUser.isPasswordCorrect(password);

  if (!matchPassword) {
    return res.status(400).json(new ApiError(400, "Incorrect credentials"));
  }

  const token = await generateToken(existingUser._id);
  const loggedInUser = await User.findById(existingUser._id).select(
    "-password"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        token,
      },
      "User logged in Successfully"
    )
  );
});

export { registerUser, loginUser };

import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";

const generateToken = async (user_id) => {
  try {
    if (!user_id) {
      throw new ApiResponse(400, "User ID is required");
    }
    const user = await User.findById(user_id);

    if (!user) {
      throw new ApiResponse(400, "User don't exist");
    }
    const token = await user.generateAccessToken();
    return token;
  } catch (error) {
    throw new ApiResponse(500, "Something went wrong while generating token");
  }
};

// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  console.log(email, username, password);

  if ([email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new ApiError(400, "Password is not strong enough");
  }

  const createdUser = await User.create({ email, username, password });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user account");
  }

  const accessToken = await generateToken(createdUser._id);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: createdUser,
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
    throw new ApiError(400, "User not found");
  }

  const matchPassword = await existingUser.isPasswordCorrect(password);

  if (!matchPassword) {
    throw new ApiError(400, "Incorrect User Credentials");
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

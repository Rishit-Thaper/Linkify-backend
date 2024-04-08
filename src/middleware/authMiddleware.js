import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/userModel.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    // console.log(token);
    if (!token) {
      return res.status(401).json(new ApiError(401, "Unauthorised request"));    
    }

    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // console.log(decodedUser);

    const user = await User.findById(decodedUser?.id).select("-password");
    // console.log(user);

    if (!user) {
      return res.status(400).json(new ApiError(400, "User don't exist"));    
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json(new ApiError(401, error?.message || "Invalid access token"));    
  }
});

export { verifyJWT };

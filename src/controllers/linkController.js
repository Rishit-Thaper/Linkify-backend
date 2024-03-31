import { asyncHandler } from "../utils/asyncHandler.js";
import { Link } from "../models/linkModel.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// @desc    Get all links
const getAllLinks = asyncHandler(async (req, res) => {
  const links = await Link.find({ user_id: req.user._id });
  if (!links) {
    throw new ApiError(404, "No links found");
  }
  return res.status(200).json(new ApiResponse(200, links, "Links found"));
});

// @desc    create single link
const createLink = asyncHandler(async (req, res) => {
  const { title, url } = req.body;
  const userId = req.user._id;
  const link = await Link.create({
    title,
    url,
    user_id: userId,
  });
  if (!link) {
    throw new ApiError(400, "Link not created");
  }
  return res.status(200).json(new ApiResponse(200, link, "Link Created"));
});

// @desc    update single link
const updateLink = asyncHandler(async (req, res) => {
  const { title, url } = req.body;
  const linkId = req.params.id;
  const updateLink = await Link.findByIdAndUpdate(
    { _id: linkId },
    {
      title,
      url,
    },
    { new: true }
  );
  if (!updateLink) {
    throw new ApiError(400, "Link not updated");
  }
  return res.status(200).json(new ApiResponse(200, updateLink, "Link Updated"));
});

// @desc    delete single link
const deleteLink = asyncHandler(async (req, res) => {
  const linkId = req.params.id;
  const deleteLink = await Link.findByIdAndDelete({ _id: linkId });
  if (!deleteLink) {
    throw new ApiError(400, "Invalid ID");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, deleteLink, "Link deleted Successfully"));
});

// @desc    get single link
const singleLink = asyncHandler(async (req, res) => {
  const linkId = req.params.id;
  const link = await Link.findById({ _id: linkId });
  if (!link) {
    throw new ApiError(400, "Link not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, link, "Link fetched Successfully"));
});

export { getAllLinks, updateLink, deleteLink, createLink, singleLink };

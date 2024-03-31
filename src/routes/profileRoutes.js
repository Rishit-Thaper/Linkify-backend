import { Router } from "express";
import {
  getProfile,
  updateProfile,
  createProfile,
  updateUserAvatar,
  getCompleteProfile,
  getCompletePublicProfile
} from "../controllers/profileController.js";
import { upload } from "../middleware/multerMiddleware.js";
import {verifyJWT} from "../middleware/authMiddleware.js";

const router = Router();

router.route("/getProfile").get(verifyJWT, getProfile);

// private profile route only visible to user
router.route("/getCompleteProfile").get(verifyJWT, getCompleteProfile);

// public profile which will be shareable
router.route("/getPublicProfile/:id").get(getCompletePublicProfile);

router.route("/createProfile").post(verifyJWT, upload.single("avatar"), createProfile);

router.route("/updateProfile").patch(verifyJWT, updateProfile);

router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);


export default router;
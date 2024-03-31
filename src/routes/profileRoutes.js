import { Router } from "express";
import {
  getProfile,
  updateProfile,
  createProfile,
  updateUserAvatar,
  getCompleteProfile
} from "../controllers/profileController.js";
import { upload } from "../middleware/multerMiddleware.js";
import {verifyJWT} from "../middleware/authMiddleware.js";

const router = Router();

router.route("/getProfile").get(verifyJWT, getProfile);

router.route("/createProfile").post(verifyJWT, upload.single("avatar"), createProfile);

router.route("/updateProfile").patch(verifyJWT, updateProfile);

// private profile route only visible to user
router.route("/getCompleteProfile").get(verifyJWT, getCompleteProfile);

router.route("/updateAvatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);


export default router;
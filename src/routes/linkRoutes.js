import { Router } from "express";
import { getAllLinks, updateLink, deleteLink, createLink, singleLink } from "../controllers/linkController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/getAllLinks").get(verifyJWT, getAllLinks);

router.route("/getSingleLink").get(verifyJWT, singleLink);

router.route("/createLink").post(verifyJWT, createLink);

router.route("/updateLink").patch(verifyJWT, updateLink);

router.route("/deleteLink").delete(verifyJWT, deleteLink);

export default router;
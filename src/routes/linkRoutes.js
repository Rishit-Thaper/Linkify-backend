import { Router } from "express";
import { getAllLinks, updateLink, deleteLink, createLink, singleLink } from "../controllers/linkController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/getAllLinks").get(verifyJWT, getAllLinks);

router.route("/getSingleLink/:id").get(verifyJWT, singleLink);

router.route("/createLink").post(verifyJWT, createLink);

router.route("/updateLink/:id").patch(verifyJWT, updateLink);

router.route("/deleteLink/:id").delete(verifyJWT, deleteLink);

export default router;
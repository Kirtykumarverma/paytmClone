import Router from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  signup,
  signin,
  updateUser,
  filterUser,
} from "../controller/user.controller.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/update-account").patch(verifyJWT, updateUser);
router.route("/search").get(filterUser);

export default router;

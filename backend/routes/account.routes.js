import { verifyJWT } from "../middleware/auth.middleware.js";
import { Router } from "express";
import {
  transferAmount,
  fetchBalance,
} from "../controller/account.controller.js";

const router = Router();

router.route("/tranfer").post(verifyJWT, transferAmount);
router.route("/balance").get(verifyJWT, fetchBalance);

export default router;

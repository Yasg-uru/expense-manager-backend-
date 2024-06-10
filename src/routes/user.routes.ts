import { Router } from "express";
import {
  ForgotPassword,
  ResetPassword,
  login,
  logout,
  registeruser,
  updatepassword,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/Auth.middleware";
import upload from "../middleware/multer.middleware";

const router: Router = Router();
router.route("/register").post(upload.single("profileurl"),registeruser);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated,logout);
router.put("/updatepassword", isAuthenticated, updatepassword);
router.post("/forgotpassword", ForgotPassword);
router.post("/resetpassword/:token", ResetPassword);

export default router;

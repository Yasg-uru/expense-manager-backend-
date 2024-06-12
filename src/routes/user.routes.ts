import { Router } from "express";
import {
  DeleteAccount,
  ForgotPassword,
  ResetPassword,
  login,
  logout,
  registeruser,
  updatepassword,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/Auth.middleware";
import upload from "../middleware/multer.middleware";

const UserRouter: Router = Router();
UserRouter.route("/register").post(upload.single("profileurl"), registeruser);
UserRouter.route("/login").post(login);
UserRouter.route("/logout").post(isAuthenticated, logout);
UserRouter.delete("/delete", isAuthenticated, DeleteAccount);
UserRouter.put("/updatepassword", isAuthenticated, updatepassword);
UserRouter.post("/forgotpassword", ForgotPassword);
UserRouter.post("/resetpassword/:token", ResetPassword);

export default UserRouter;

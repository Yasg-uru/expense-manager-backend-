import { Router } from "express";
import {
  DeleteAccount,
  ForgotPassword,
  GetUserInfo,
  ResetPassword,
  UpdateProfile,
  UpdateProfilePicture,
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
UserRouter.route("/logout").post( logout);
UserRouter.put("/changeProfile",isAuthenticated,upload.single("profileurl"),UpdateProfilePicture);
UserRouter.put("/update",isAuthenticated,UpdateProfile);

UserRouter.delete("/delete", isAuthenticated, DeleteAccount);
UserRouter.put("/updatepassword", isAuthenticated, updatepassword);
UserRouter.post("/forgotpassword", ForgotPassword);
UserRouter.post("/resetpassword/:token", ResetPassword);
UserRouter.get("/userInfo",isAuthenticated,GetUserInfo);

export default UserRouter;

import User from "../models/User.model";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import generatetoken from "../utils/generateToken";
import sendtoken from "../utils/sendtoken";
import catchAsync from "../middleware/catchasyn.middleware";
import { RequestWithUser } from "../middleware/Auth.middleware";
import Errorhandler from "../utils/ErrorHandler";
import crypto from "crypto";
import { sendResetMail } from "../utils/nodemailer";
import { UploadOnCloudinary } from "../utils/cloudinary";

export const registeruser = async (req: RequestWithUser, res: Response) => {
  const { name, email, password } = req.body;

  const hashedpassword = await bcrypt.hash(password, 10);
  let user;
  if (req.file && req.file.path) {
    const cloudinary = await UploadOnCloudinary(req.file.path);
    const profileurl=cloudinary?.secure_url;
    
    user = await User.create({
      name,
      email,
      password: hashedpassword,
      profileurl,
    });
  } else {
    user = await User.create({
      name,
      email,
      password: hashedpassword,
    });
  }
  const gettoken = await generatetoken(user);

  sendtoken(res, gettoken, 200, user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new Errorhandler(404, "please Enter valid email and password")
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new Errorhandler(404, "Invalid Credentials"));
    }
    const ismatched: boolean = await bcrypt.compare(password, user.password);
    if (!ismatched) {
      return next(new Errorhandler(404, "Invalid Email or password"));
    }
    const gettoken = await generatetoken(user);
    sendtoken(res, gettoken, 200, user);
  } catch (error) {
    return next(new Errorhandler(500, "Internal server Error"));
  }
};
export async function logout(req: RequestWithUser, res: Response) {
  try {
    res.cookie("token", null, {
      expires: new Date(0),

      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error ",
    });
  }
}
export const updatepassword = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;

      const user = await User.findById(userId);
      if (!user) {
        return next(new Errorhandler(404, "please login to continue"));
      }
      const { currentpassword, passwordToupdate } = req.body;
      const comparepassword = await bcrypt.compare(
        currentpassword,
        user.password
      );
      if (!comparepassword) {
        return next(new Errorhandler(404, "Invalid current password"));
      }
      const salt = await bcrypt.genSalt(10);
      const Hashedpassword = await bcrypt.hash(passwordToupdate, salt);
      user.password = Hashedpassword;
      await user.save();
      const gettoken = await generatetoken(user);

      sendtoken(res, gettoken, 200, user);
    } catch (error) {
      return next(new Errorhandler(500, "Internal Server Error"));
    }
  }
);

export const ForgotPassword = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(new Errorhandler(404, "user not found"));
      }
      const token = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = token;
      user.resetPasswordTokenExpire = new Date(Date.now() + 3600000);
      await user.save();
      await sendResetMail(email, token);
      res.status(200).json({
        success: true,
        message: "Mail sent successfully",
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal Server Error"));
    }
  }
);
export const ResetPassword = catchAsync(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;

      const { password } = req.body;
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpire: { $gt: new Date() },
      });
      if (!user) {
        return next(new Errorhandler(404, "user not found"));
      }
      const Hashedpassword = await bcrypt.hash(password, 10);

      user.password = Hashedpassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpire = undefined;
      await user.save();
      res.status(200).json({
        message: "successfully updated password",
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal server error"));
    }
  }
);

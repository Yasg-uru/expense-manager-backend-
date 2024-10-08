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

export const registeruser = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;

    const hashedpassword = await bcrypt.hash(password, 10);
    let user;
    if (req.file && req.file.path) {
      const cloudinary = await UploadOnCloudinary(req.file.path);
      const profileurl = cloudinary?.secure_url;

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
  } catch (error) {
    next();
  }
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
    return next(error);
  }
};
export async function logout(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
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
    next();
  }
}
export const updatepassword = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
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
    next();
  }
};

export const ForgotPassword = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
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
    next();
  }
};

export const ResetPassword = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
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
    next();
  }
};

export const DeleteAccount = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;
    const user = await User.findById(id);
    if (!user) {
      return next(new Errorhandler(404, "user not found"));
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      messaage: "successfully deleted your account",
    });
  } catch (error) {
    next();
  }
};

export const UpdateProfilePicture = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;
    if (!req.file || !req.file.path) {
      return next(new Errorhandler(404, "Image Not Provided"));
    }
    const cloudinary: any = await UploadOnCloudinary(req.file.path);
    const profileurl = cloudinary?.secure_url;
    const user = await User.findByIdAndUpdate(id, {
      profileurl,
    });
    if (!user) {
      return next(new Errorhandler(404, "User not updated "));
    }
    res.status(200).json({
      success: true,
      message: "Image changed successfully",
      user,
    });
  } catch (error) {
    console.log("this is a error:", error);
    next();
  }
};
export const UpdateProfile = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Updated your changes successfully",
      user,
    });
  } catch (error) {
    next();
  }
};

export const GetUserInfo = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user?._id;
    const user = await User.findById(id);
    res.status(200).json({
      success: true,
      message: "Fetched user data successfully",
      user,
    });
  } catch (error) {
    next();
  }
};

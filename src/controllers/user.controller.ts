import User from "../models/User.model";
import { NextFunction, Request, Response } from "express";

import bcrypt from "bcryptjs";
import generatetoken from "../utils/generateToken";
import sendtoken from "../utils/sendtoken";
import catchAsync from "../middleware/catchasyn.middleware";
import { RequestWithUser } from "../middleware/Auth.middleware";
import Errorhandler from "../utils/ErrorHandler";
export const registeruser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedpassword,
  });
  const gettoken = await generatetoken(user);

  sendtoken(res, gettoken, 200, user);
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).json({
        message: "please enter email or password",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }
    const ismatched: boolean = await bcrypt.compare(password, user.password);
    if (!ismatched) {
      res.status(404).json({
        message: "Invalid email or password",
      });
    }
    const gettoken = await generatetoken(user);
    sendtoken(res, gettoken, 200, user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
export async function logout(res: Response) {
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
      res.status(200).json({
        success: true,
        message: "updated your password successfully",
      });
    } catch (error) {
      return next(new Errorhandler(500, "Internal Server Error"));
    }
  }
);


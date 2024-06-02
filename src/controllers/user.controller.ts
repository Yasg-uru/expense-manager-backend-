import User, { Iuser } from "../models/User.model";
import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import generatetoken from "../utils/generateToken";
import sendtoken from "../utils/sendtoken";
export const registeruser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedpassword,
  });
  const gettoken = await generatetoken(user._id);

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
    const user = await User.findOne({ email: email });
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
    const gettoken = await generatetoken(user._id);
    sendtoken(res,gettoken,200,user);
  } catch (error) {
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
export async function logout(req:Request,res:Response){
  try {
     res.cookie("token",null,{
      expires:new Date(0),

      httpOnly:true
    })
    res.status(200).json({
      success:true,
      message:"Logged out successfully"
    })
  } catch (error) {
    res.status(500).json({
      message:"internal server error "
    })
  }
}
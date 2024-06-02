import User from "../models/User.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
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

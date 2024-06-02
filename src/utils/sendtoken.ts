import { Response } from "express";
import { Iuser } from "../models/User.model";
const sendtoken = (
  res: Response,
  token: String,
  statuscode: number,
  user: Iuser
) => {
  const options = {
    exprires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token", token, options).status(statuscode).json({
    success: true,
    user,
    token,
  });
};
export default sendtoken;


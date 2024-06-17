import { Response } from "express";
import { Iuser } from "../models/User.model";
const sendtoken = (
  res: Response,
  token: string,
  statuscode: number,
  user: Iuser
) => {
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: false,
    sameSite: "none" as const,
    secure: true,
  };
  res.cookie("token", token, options).status(statuscode).json({
    success: true,
    user,
    token,
  });
};
export default sendtoken;

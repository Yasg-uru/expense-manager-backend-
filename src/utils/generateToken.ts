import jwt from "jsonwebtoken";
import { ObjectId } from "mongoose";

const generatetoken = async (id:any) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

export default generatetoken;

import jwt from "jsonwebtoken";
import { Iuser } from "../models/User.model";

const generatetoken = async (user: Iuser) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

export default generatetoken;

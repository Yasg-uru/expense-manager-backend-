
// import { Request, NextFunction } from "express";
// import Errorhandler from "../utils/ErrorHandler";
// import jwt from "jsonwebtoken";
// import { Requestwithuser } from "../types/RequestWithUser ";
// import JwtDecodedUser from "../types/jwtDecodedUser";
// import {Iuser} from "../models/User.model"
// // Define a new interface that extends Request
// // export interface AuthenticatedRequest extends Request {
// //   user?: Iuser | null ;// Include user property in the request
// // }
// export interface RequestWithUser extends Request {
//   user?: Iuser | null;
// }

// export function isAuthenticated (
//   req: Requestwithuser,
//   res: Response,
//   next: NextFunction
// ) {
//   const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return next(new Errorhandler(404, "Please login to continue"));
//   }

//   const decodedData = jwt.verify(
//     token,
//     process.env.JWT_SECRET as string
//   ) as JwtDecodedUser;

//   // (req as Requestwithuser).user = decodedData;

//   next();
// };
// src/middleware/isAuthenticated.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";
import ErrorHandler from "../utils/ErrorHandler";
import JwtDecodedUser from "../types/jwtDecodedUser";
import { Iuser } from "../models/User.model";

export interface RequestWithUser extends Request {
  user?: Iuser | null;
}

export const isAuthenticated = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ErrorHandler(404, "Please login to continue"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtDecodedUser;
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(new ErrorHandler(404, "User not found"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ErrorHandler(401, "Not authorized, token failed"));
  }
};

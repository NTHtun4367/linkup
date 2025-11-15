import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../utils/env";
import { User } from "../models/user";

interface User {
  _id: Types.ObjectId | string;
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;
    token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Unauthorized.");
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as JwtPayload;

    if (!decoded) {
      res.status(401);
      throw new Error("Unauthorized, Invalid token.");
    }

    req.user = (await User.findById(decoded.userId).select(
      "-password"
    )) as User;

    next();
  }
);

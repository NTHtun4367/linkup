import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "../utils/env";
import { User } from "../models/user";

export interface AuthRequest extends Request {
  user?: {
    _id: Types.ObjectId | string;
    name: string;
    email: string;
  };
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

    const userDoc = await User.findById(decoded.userId).select("-password");
    if (!userDoc) {
      res.status(401);
      throw new Error("Unauthorized, User not found.");
    }
    
    req.user = {
      _id: userDoc._id as Types.ObjectId,
      name: userDoc.name,
      email: userDoc.email,
    };

    next();
  }
);

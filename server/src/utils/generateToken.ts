import { Response } from "express";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { ENV } from "./env";

const generateToken = (res: Response, userId: Types.ObjectId) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  });
};

export default generateToken;

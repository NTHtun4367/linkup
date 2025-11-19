import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user";
import { sendWelcomeEmail } from "../utils/sendEmail";
import { ENV } from "../utils/env";
import generateToken from "../utils/generateToken";
import { AuthRequest } from "../middlewares/auth";
import { deleteImage, uploadSingleImage } from "../utils/cloudinary";

// @route /api/auth/register
// @desc Register new user
// @access POST | Public
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error("Email already exists!");
  }

  const newUser = await User.create({ name, email, password });

  await sendWelcomeEmail(newUser.email, newUser.name, ENV.CLIENT_URL!);

  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  }
});

// @route /api/auth/login
// @desc Login to existing user's account
// @access POST | Public
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser && (await existingUser.matchPassword(password))) {
    generateToken(res, existingUser._id);
    res.status(200).json({
      _id: existingUser._id,
    });
  } else {
    res.status(404);
    throw new Error("User not found with this credentials.");
  }
});

// @route /api/auth/logout
// @desc Clear token
// @access POST | Public
export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logout successfully." });
});

// @route /api/auth/update-profile
// @desc Update user's profile
// @access PUT | Public
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { image_url } = req.body;

    const userDoc = await User.findById(user?._id);

    if (userDoc?.profile_image?.url) {
      await deleteImage(userDoc.profile_image.public_alt);
    }

    const response = await uploadSingleImage(
      image_url,
      "linkup/profile-images"
    );

    await User.findByIdAndUpdate(user?._id, {
      profile_image: {
        url: response.image_url,
        public_alt: response.public_alt,
      },
    });

    res.status(200).json({ message: "Profile image uploaded." });
  }
);

// @route /api/auth/me
// @desc Get login user's information
// @access GET | Private
export const getUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;

    const userDoc = await User.findById(user?._id).select("-password");

    if (!userDoc) {
      res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(userDoc);
  }
);

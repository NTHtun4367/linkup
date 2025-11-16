import { response, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { User } from "../models/user";
import { Message } from "../models/message";
import { uploadSingleImage } from "../utils/cloudinary";

// @route  /api/auth/contacts
// @desc Get all contacts
// @access GET | Public
export const getAllContacts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const currentUserId = user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    if (!filteredUsers) {
      res.status(404).json({ message: "No users found." });
    }

    res.status(200).json(filteredUsers);
  }
);

// @route /api/auth/:id
// @desc Get message by userId
// @access GET | Public
export const getMessageByUserId = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { id: userToChatId } = req.params;
    const currentUserId = user?._id;

    const message = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUserId },
      ],
    });

    if (!message) {
      res.status(404).json({ message: "No message found." });
    }

    res.status(200).json(message);
  }
);

// @route /api/auth/send/:id
// @desc Send message to another user
// @access POST | Public
export const sendMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { id: receiverId } = req.params;
    const { text, image_url } = req.body;
    const senderId = user?._id;

    if (senderId?.toString() === receiverId.toString()) {
      res.status(400).json({ message: "Cannot send message to yourself." });
    }

    const receiverExists = await User.exists({ _id: receiverId });

    if (!receiverExists) {
      res.status(404).json({ message: "Receiver not found." });
    }

    let imageUrl;
    if (image_url) {
      const response = await uploadSingleImage(
        image_url,
        "linkup/message-images"
      );
      imageUrl = response.image_url;
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // todo => send message in real-time if user is online with socket.io

    res.status(200).json(newMessage);
  }
);

// @route /api/auth/chats
// @desc Get chat partners
// @access GET | Public
export const getChatPartners = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const currentUserId = user?._id;

    // find all the messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === currentUserId?.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];

    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select("-password");

    res.status(200).json(chatPartners);
  }
);

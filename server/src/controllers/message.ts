import { Response } from "express";
import { Types } from "mongoose";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/auth";
import { User } from "../models/user";
import { Message } from "../models/message";
import { uploadSingleImage, uploadFile } from "../utils/cloudinary";

// @route  /api/messages/contacts
// @desc Get all contacts
// @access GET | Private
export const getAllContacts = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const currentUserId = user?._id;
    const filteredUsers = await User.find({
      _id: { $ne: currentUserId },
    }).select("-password");

    res.status(200).json(filteredUsers || []);
  }
);

// @route /api/messages/:id
// @desc Get message by userId
// @access GET | Private
export const getMessageByUserId = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { id: userToChatId } = req.params;
    const currentUserId = user?._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currentUserId },
      ],
    });

    res.status(200).json(messages || []);
  }
);

// @route /api/messages/send/:id
// @desc Send message to another user
// @access POST | Private
export const sendMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { id: receiverId } = req.params;
    const { text, image_url, file_data, file_name, file_type } = req.body;
    const senderId = user?._id;

    if (senderId?.toString() === receiverId.toString()) {
      res.status(400).json({ message: "Cannot send message to yourself." });
      return;
    }

    const receiverExists = await User.exists({ _id: receiverId });

    if (!receiverExists) {
      res.status(404).json({ message: "Receiver not found." });
      return;
    }

    try {
      let imageUrl;
      if (image_url) {
        const response = await uploadSingleImage(
          image_url,
          "linkup/message-images"
        );
        imageUrl = response.url;
      }

      let fileObj;
      if (file_data) {
        const response = await uploadFile(file_data, "linkup/message-files");
        fileObj = {
          url: response.url,
          name: file_name || "file",
          type: file_type || "application/octet-stream",
        };
      }

      if (!text && !imageUrl && !fileObj) {
        res.status(400).json({ message: "Message content is required" });
        return;
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text: text || "",
        image: imageUrl,
        file: fileObj,
        reactions: [],
      });

      res.status(200).json(newMessage);
    } catch (err: any) {
      console.error("Error sending message:", err);
      res.status(500).json({ message: err.message || "Failed to send message" });
    }
  }
);

// @route /api/messages/react/:id
// @desc React to a message
// @access POST | Private
export const reactToMessage = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const { id: messageId } = req.params;
    const { emoji } = req.body;
    const currentUserId = user?._id;

    const message = await Message.findById(messageId);

    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === currentUserId?.toString()
    );

    if (existingReactionIndex > -1) {
      if (message.reactions[existingReactionIndex].emoji === emoji) {
        message.reactions.splice(existingReactionIndex, 1);
      } else {
        message.reactions[existingReactionIndex].emoji = emoji;
      }
    } else {
      message.reactions.push({
        emoji,
        userId: new Types.ObjectId(currentUserId!),
      });
    }

    await message.save();

    res.status(200).json(message);
  }
);

// @route /api/messages/chats
// @desc Get chat partners
// @access GET | Private
export const getChatPartners = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    const currentUserId = user?._id;

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

    res.status(200).json(chatPartners || []);
  }
);

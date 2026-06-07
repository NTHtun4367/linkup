import { model, Schema, Types, Document } from "mongoose";

interface IReaction {
  emoji: string;
  userId: Types.ObjectId;
}

interface IMessage extends Document {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text?: string;
  image?: string;
  file?: {
    url: string;
    name: string;
    type: string;
  };
  reactions: IReaction[];
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    file: {
      url: {
        type: String,
      },
      name: {
        type: String,
      },
      type: {
        type: String,
      },
    },
    reactions: [
      {
        emoji: {
          type: String,
          required: true,
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export const Message = model<IMessage>("Message", messageSchema);

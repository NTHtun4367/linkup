export interface Reaction {
  emoji: string;
  userId: string;
}

export interface Message {
  _id: string;
  senderId: string;
  text?: string;
  image?: string;
  file?: {
    url: string;
    name: string;
    type: string;
  };
  reactions: Reaction[];
  createdAt: string;
}

import { ExternalUserData } from "@/types";

export type Message = {
  createdAt: Date;
  sender: string;
  content: string;
  id: string;
};

export type Conversation = {
  conversationId: string;
  createdAt: Date;
  lastMessage: string;
  lastMessageCreatedAt: Date;
  participants: ExternalUserData[];
};

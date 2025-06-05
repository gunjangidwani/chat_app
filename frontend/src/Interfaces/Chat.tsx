import { UserInterface } from "./User";

export interface LatestMessageInterface {
  chat: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
  sender: UserInterface;
}

export interface ChatListInterface {
  chatName: string;
  createdAt: string;
  updatedAt: string;
  isGroupChat: boolean;
  latestMessage: LatestMessageInterface | string;
  latestMessageReadBy: string[];
  users: UserInterface[] | string[];
  __v: number;
  _id: string;
}

export interface ChatMessageList {
  _id: string;
  sender: UserInterface;
  content: string;
  chat: ChatListInterface;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  displayName: string;
  email: string;
  nickname?: string;
  isAdmin?: boolean;
  emojis?: string[];
  year?: number;
  interests?: string[];
  bio?: string;
  hasProfilePicture?: boolean;
  createdAt?: string;
  name?: string;
  picture?: string;
  token?: string;
}

export interface ProfileUser {
  _id: string;
  displayName: string;
  email: string;
  nickname?: string;
  isAdmin?: boolean;
  emojis?: string[];
  year?: number;
  interests?: string[];
  bio?: string;
  hasProfilePicture?: boolean;
  createdAt?: string;
} 
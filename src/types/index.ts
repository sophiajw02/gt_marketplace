import { UserCredential } from "@firebase/auth";

export type Listing = {
  id: string;
  author: string;
  isActive: boolean;
  price: number;
  tag: string;
  images: string[];
  createdAt: Date;
  description: string;
  status: "available" | "sold" | "unavailable";
  title: string;
};

export type ProfileData = {
  id: string;
  name: string;
  major: string;
  year: "" | "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";
  profilePicture?: File | string;
};

export type UserData = {
  firebaseUser: UserCredential["user"];
  profilePicture: string;
  name: string;
  major: string;
  favorites: string[];
  year: "" | "Freshman" | "Sophomore" | "Junior" | "Senior" | "Graduate";
};

export type ExternalUserData = Omit<UserData, "firebaseUser"> & {
  id: string;
};

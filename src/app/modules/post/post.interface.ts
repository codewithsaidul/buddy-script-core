import { Model, Types } from "mongoose";

export enum PostVisibility {
  PUBLIC = "public",
  PRIVATE = "private"
}

export interface IPost {
  _id?: string;
  author: Types.ObjectId;
  content: string;
  image?: string;
  visibility: PostVisibility;
  likes: Types.ObjectId[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PostModel = Model<IPost>;
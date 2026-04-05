import { Model, Types } from "mongoose";

export interface IComment {
  _id?: string;
  post: Types.ObjectId;  
  user: Types.ObjectId; 
  text: string;
  parentId?: Types.ObjectId | null;
  likes: Types.ObjectId[];
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CommentModel = Model<IComment>;
import { Schema, model } from "mongoose";
import { IComment, CommentModel } from "./comments.interface";

const commentSchema = new Schema<IComment, CommentModel>(
  {
    post: { 
      type: Schema.Types.ObjectId, 
      ref: "Post", 
      required: [true, "Post ID is required"] 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "User ID is required"] 
    },
    text: { 
      type: String, 
      required: [true, "Comment text is required"],
      trim: true 
    },
    parentId: { 
      type: Schema.Types.ObjectId, 
      ref: "Comment", 
      default: null 
    },
    likes: [{ 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      default: [] 
    }],
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true, versionKey: false }
);


commentSchema.index({ post: 1, createdAt: -1 });

commentSchema.index({ parentId: 1 });

export const Comment = model<IComment, CommentModel>("Comment", commentSchema);
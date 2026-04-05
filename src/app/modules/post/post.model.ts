import { Schema, model } from "mongoose";
import { IPost, PostModel, PostVisibility } from "./post.interface";

const postSchema = new Schema<IPost, PostModel>(
  {
    author: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, "Author is required"] 
    },
    content: { 
      type: String, 
      trim: true 
    },
    image: { type: String, default: "" },
    visibility: { 
      type: String, 
      enum: Object.values(PostVisibility), 
      default: PostVisibility.PUBLIC 
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

postSchema.index({ visibility: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

export const Post = model<IPost, PostModel>("Post", postSchema);
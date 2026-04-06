import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { User } from "../user/user.model";
import { IPost, PostVisibility } from "./post.interface";
import { Post } from "./post.model";
import { Types } from "mongoose";

export const PostService = {
  createPost: async (payload: IPost, authorId: string) => {
    // Implementation for creating a post
    const isUserExists = await User.findById(authorId);
    if (
      !isUserExists ||
      isUserExists.isDeleted ||
      isUserExists.status !== "active"
    ) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "User is not authorized to post!",
      );
    }

    // Logic to create a post goes here
    const postData = {
      ...payload,
      author: authorId,
    };
    const result = await Post.create(postData);

    return result;
  },

  getPosts: async (authorId: string, query: Record<string, string>) => {
    // Implementation for fetching posts based on query parameters
    const queryBuilder = new QueryBuilder(
      Post.find({
        $or: [{ visibility: PostVisibility.PUBLIC }, { author: authorId }],
        isDeleted: false
      }),
      query,
    );

    const posts = queryBuilder
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("author", "firstName lastName profileImg")
      .populate("likes", "firstName lastName profileImg");

    const [data, meta] = await Promise.all([
      posts.build(),
      queryBuilder.getMeta(),
    ]);

    return {
      meta,
      data,
    };
  },

  toggleLike: async (postId: string, userId: string) => {
    const post = await Post.findById(postId);
    if (!post) throw new AppError(StatusCodes.NOT_FOUND, "Post not found");

    const isLiked = post.likes.includes(new Types.ObjectId(userId));

    if (isLiked) {
      return await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true },
      );
    } else {
      return await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true },
      );
    }
  },
};

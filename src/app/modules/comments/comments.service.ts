import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { Post } from "../post/post.model";
import { IComment } from "./comments.interface";
import { Comment } from "./comments.model";

export const CommentService = {
  createComment: async (payload: IComment) => {
    if (payload.parentId) {
      const parentComment = await Comment.findById(payload.parentId);
      if (!parentComment) {
        throw new AppError(StatusCodes.NOT_FOUND, "Parent comment not found");
      }
      payload.post = parentComment.post;
    }

    const isExistPost = await Post.findById(payload.post);
    if (!isExistPost) {
      throw new AppError(StatusCodes.NOT_FOUND, "Post not found");
    }

    const result = await Comment.create(payload);

    return result;
  },

  getCommentsByPost: async (postId: string, query: Record<string, string>) => {
    const queryBuilder = new QueryBuilder(
      Comment.find({
        isDeleted: false,
        post: postId,
      }),
      query,
    );

    const comments = queryBuilder
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("user", "firstName lastName profileImg");

    const [data, meta] = await Promise.all([
      comments.build(),
      queryBuilder.getMeta(),
    ]);

    return {
      meta,
      data,
    };
  },

  getReplies: async (commentId: string, query: Record<string, string>) => {
    if (!commentId || commentId === "undefined" || commentId === null) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "A valid Comment ID is required to fetch replies!",
      );
    }
    const queryBuilder = new QueryBuilder(
      Comment.find({
        isDeleted: false,
        parentId: commentId,
      }),
      query,
    );

    const comments = queryBuilder
      .filter()
      .sort()
      .fields()
      .paginate()
      .populate("user", "firstName lastName profileImg");

    const [data, meta] = await Promise.all([
      comments.build(),
      queryBuilder.getMeta(),
    ]);

    return {
      meta,
      data,
    };
  },

  toggleCommentLike: async (commentId: string, userId: string) => {
    const comment = await Comment.findById(commentId);
    if (!comment)
      throw new AppError(StatusCodes.NOT_FOUND, "Comment not found");

    const isLiked = comment.likes.some((id) => id.toString() === userId);
    const update = isLiked
      ? { $pull: { likes: userId } }
      : { $addToSet: { likes: userId } };

    return await Comment.findByIdAndUpdate(commentId, update, { new: true });
  },

  deleteComment: async (commentId: string, userId: string) => {
    const isExistComment = await Comment.findById(commentId).populate("post");

    if (!isExistComment)
      throw new AppError(StatusCodes.NOT_FOUND, "Comment not found");

    const isPostOwner =
      (
        isExistComment.post as unknown as { author: string }
      ).author.toString() === userId;
    const isCommentOwner = isExistComment.user.toString() === userId;

    const isAuthorized = !isPostOwner || !isCommentOwner;

    if (isAuthorized) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not the owner of this comment",
      );
    }

    const deleteComment = await Comment.updateMany(
      { $or: [{ _id: commentId }, { parentId: commentId }] },
      { isDeleted: true },
    );

    return deleteComment;
  },
};

import { JwtPayload } from "jsonwebtoken";
import { TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { IComment } from "./comments.interface";
import { CommentService } from "./comments.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

export const CommentController = {
  createComment: catchAsync(async (req: TRequest, res: TResponse) => {
    const { userId } = req.user as JwtPayload;
    const postId = req.params.postId as string;

    const payload: IComment = {
      ...req.body,
      user: userId as string,
      post: postId as string,
    };

    const result = await CommentService.createComment(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: result.parentId ? "Comment replied successfully" : "Comment Created Successfully!",
      data: result,
    });
  }),

  getCommentsByPost: catchAsync(async (req: TRequest, res: TResponse) => {
    const postId = req.params.postId as string;

    const { data, meta } = await CommentService.getCommentsByPost(
      postId as string,
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Comments retrieved Successfully!",
      data,
      meta,
    });
  }),

  getReplies: catchAsync(async (req: TRequest, res: TResponse) => {
    const commentId = req.params.commentId as string;

    const { data, meta } = await CommentService.getReplies(
      commentId as string,
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Comments replies retrieved Successfully!",
      data,
      meta,
    });
  }),

  toggleCommentLike: catchAsync(async (req: TRequest, res: TResponse) => {
    const { userId } = req.user as JwtPayload;
    const commentId = req.params.commentId as string;

    const result = await CommentService.toggleCommentLike(
      commentId as string,
      userId as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Comments like toggled Successfully!",
      data: result,
    });
  }),

  deleteComment: catchAsync(async (req: TRequest, res: TResponse) => {
    const { userId } = req.user as JwtPayload;
    const commentId = req.params.commentId as string;

    const result = await CommentService.deleteComment(
      commentId as string,
      userId as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Comment deleted Successfully!",
      data: result,
    });
  }),
};

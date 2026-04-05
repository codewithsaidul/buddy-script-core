import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IPost } from "./post.interface";
import { PostService } from "./post.service";

export const PostController = {
  createPost: catchAsync(async (req: TRequest, res: TResponse) => {
    const { userId } = req.user as JwtPayload;
    const payload: IPost = {
      ...req.body,
      image: req?.file?.path,
    };
    const result = await PostService.createPost(payload, userId as string);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Post Created Successfully!",
      data: result,
    });
  }),

  getPosts: catchAsync(async (req: TRequest, res: TResponse) => {
    const { userId } = req.user as JwtPayload;

    const { data, meta } = await PostService.getPosts(
      userId as string,
      req.query as Record<string, string>,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Posts retrieved successfully!",
      data, meta
    });
  }),

  toggleLike: catchAsync(async (req: TRequest, res: TResponse) => {
    const { userId } = req.user as JwtPayload;

    const result = await PostService.toggleLike(
        req.params.postId as string,
        userId as string,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Post like toggled successfully!",
      data: result,
    });
  }),
};

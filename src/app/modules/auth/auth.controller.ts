/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import passport from "passport";
import { envVars } from "../../config/env";
import { AppError } from "../../errorHelpers/AppError";
import { TNext, TRequest, TResponse } from "../../types/global";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserToken } from "../../utils/userToken";
import { AuthServices } from "./auth.service";
import { IUser } from "../user/user.interface";

export const AuthController = {
  createUser: catchAsync(async (req: TRequest, res: TResponse, next: TNext) => {
    const payload: IUser = {
      ...req.body,
      profileImg: req?.file?.path,
    };
    const user = await AuthServices.createUser(payload);

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Account created successfully",
      data: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        profileImg: user.profileImg,
        role: user.role,
      },
    });
  }),


  credentialsLogin: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      passport.authenticate(
        "local",
        { session: false },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any, user: any, info: any) => {
          if (err) {
            return next(new AppError(StatusCodes.BAD_REQUEST, err));
          }

          if (!user && info.message === "User not found") {
            return next(new AppError(StatusCodes.NOT_FOUND, info.message));
          }
          if (
            !user &&
            info.message ===
              "You're not verified yet, please verify your email first"
          ) {
            return next(new AppError(StatusCodes.UNAUTHORIZED, info.message));
          }
          if (!user && info.message === "Incorrect password") {
            return next(new AppError(StatusCodes.BAD_REQUEST, info.message));
          }

          if (!user) {
            return next(new AppError(StatusCodes.BAD_REQUEST, info.message));
          }

          const { accessToken, refreshToken } = createUserToken(user);

          setAuthCookie(res, { accessToken, refreshToken });

          sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User logged in successfully",
            data: {
              accessToken,
              refreshToken,
              user: {
                _id: user._id,
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                profileImg: user.profileImg,
                role: user.role,
              },
            },
          });
        }
      )(req, res, next);
    }
  ),


  getMe: catchAsync(async (req: TRequest, res: TResponse, next: TNext) => {
  const { userId, role } = req.user as JwtPayload;

  const result = await AuthServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
}),

  getNewAccessToken: catchAsync(
    async (req: TRequest, res: TResponse, next: TNext) => {
      const refreshToken = req?.cookies?.refreshToken;

      const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

      setAuthCookie(res, tokenInfo);

      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "New access token generated successfully",
        data: tokenInfo,
      });
    }
  ),

  logout: catchAsync(async (req: TRequest, res: TResponse, next: TNext) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User Logged Out Successfully",
      data: null,
    });
  }),

};

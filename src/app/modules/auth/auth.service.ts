import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import { AppError } from "../../errorHelpers/AppError";
import {
  createAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { IUser, UserStatus } from "../user/user.interface";
import { User } from "../user/user.model";

export const AuthServices = {
  createUser: async (payload: Partial<IUser>) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const isUserExist = await User.findOne({ email: payload.email });
      if (isUserExist) {
        throw new AppError(
          StatusCodes.CONFLICT,
          "User already exists with this email",
        );
      }

      const userData: Partial<IUser> = {
        ...payload,
        status: UserStatus.ACTIVE,
      };

      const newUser = await User.create([userData], { session });

      if (!newUser.length) {
        throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
      }

      const createdUser = newUser[0];

      await session.commitTransaction();
      session.endSession();

      const result = createdUser.toObject();
      delete result.password;

      return result;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  credentialsLogin: async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    const isPasswordMatch = await bcrypt.compare(
      password as string,
      isUserExist?.password as string,
    );

    if (!isPasswordMatch) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Incorrect password");
    }

    const { accessToken, refreshToken } = createUserToken(isUserExist);

    return {
      accessToken,
      refreshToken,
      user: {
        _id: isUserExist._id,
        name: `${isUserExist.firstName} ${isUserExist.lastName}`,
        email: isUserExist.email,
        profilePicture: isUserExist.profileImg,
        role: isUserExist.role,
      },
    };
  },

  getMe: async (userId: string, role: string) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
    }

    if (user.role !== role) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Role mismatch!");
    }

    return user;
  },

  getNewAccessToken: async (refreshToken: string) => {
    // Logic to verify the refresh token and generate a new access token
    if (!refreshToken) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "You haven't any refresh token",
      );
    }

    const newAccessToken =
      await createAccessTokenWithRefreshToken(refreshToken);
    return {
      accessToken: newAccessToken,
    };
  },
};

import { StatusCodes } from "http-status-codes";
import { AppError } from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/queryBuilder";
import { userSearchableFields } from "./user.constants";
import { IUser, UserStatus } from "./user.interface";
import { User } from "./user.model";

export const UserService = {
  getAllUsers: async (query: Record<string, unknown>) => {
    const usersQueryBuilder = new QueryBuilder(
      User.find({
        isDeleted: false,
      }),
      query,
    )
      .search(userSearchableFields)
      .filter()
      .sort()
      .paginate()
      .fields();

    const [data, meta] = await Promise.all([
      usersQueryBuilder
        .build()
        .select("-password -auths -isPasswordResetTokenUsed"),
      usersQueryBuilder.getMeta(),
    ]);

    return {
      data,
      meta,
    };
  },

  getUserProfile: async (userId: string) => {
    const user = await User.findById(userId);

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (user.isDeleted) {
      throw new AppError(StatusCodes.FORBIDDEN, "User is deleted");
    }
    if (user.status === UserStatus.BLOCKED) {
      throw new AppError(StatusCodes.FORBIDDEN, "User is blocked");
    }

    return user;
  },

  updateUserInfo: async (userId: string, payload: Partial<IUser>) => {
    const userToUpdate = await User.findById(userId);

    if (!userToUpdate) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (payload.role || payload.status || payload.email) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You cannot update sensitive fields (Role, Status, Email)",
      );
    }

    const result = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });

    return result;
  },

  deleteUser: async (userId: string) => {
    const userToDelete = await User.findById(userId);

    if (!userToDelete) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    userToDelete.isDeleted = true;
    await userToDelete.save();

    return null;
  },
};

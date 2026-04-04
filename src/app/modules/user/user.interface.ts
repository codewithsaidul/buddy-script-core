import { Model } from "mongoose";

export enum UserRole {
  USER = "user"
}

export enum UserStatus {
  PENDING = "pending",
  BLOCKED = "blocked",
  ACTIVE = "active"
}

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  bio?: string;
  interests?: string[];
  location?: string;
  role?: UserRole;
  status?: UserStatus;
  profileImg?: string; 
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): Promise<boolean>;
}
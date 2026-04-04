import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserModel, UserRole, UserStatus } from "./user.interface";
import { envVars } from "../../config/env";

const userSchema = new Schema<IUser, UserModel>(
  {
    firstName: { type: String, required: true, trim: true }, // Added
    lastName: { type: String, required: true, trim: true },  // Added
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: 0 },
    phone: { type: String },
    bio: { type: String, default: "" },
    interests: { type: [String], default: [] },
    location: { type: String },
    profileImg: { 
      type: String, 
      default: "https://cdn-icons-png.flaticon.com/512/149/149071.png" 
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);


userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(
      this.password,
      Number(envVars.BCRYPT_SALT_ROUND) || 10
    );
  }
  next();
});

// Statics
userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await this.findOne({ email, isDeleted: false }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>("User", userSchema);
import { z } from "zod";
import { UserRole, UserStatus } from "./user.interface";

export const createUserZodSchema = z.object({
  firstName: z
    .string({ message: "First Name is required" })
    .min(2, "First Name must be at least 2 characters long")
    .max(50, "First Name cannot exceed 50 characters"),
  
  lastName: z
    .string({ message: "Last Name is required" })
    .min(2, "Last Name must be at least 2 characters long")
    .max(50, "Last Name cannot exceed 50 characters"),

  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
  
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
  location: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  profileImg: z.string().optional(),
});

export const updateUserZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  profileImg: z.string().optional(),
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
  location: z.string().optional(),
});
import { z } from "zod";
import { PostVisibility } from "./post.interface";

export const createPostZodSchema = z.object({
  content: z
    .string({ message: "Content is required" })
    .min(1, "Post cannot be empty")
    .max(2000, "Post content is too long"),
  image: z.string().optional(),
  visibility: z
    .nativeEnum(PostVisibility)
    .optional()
    .default(PostVisibility.PUBLIC),
});

export const updatePostZodSchema = z.object({
  content: z.string().optional(),
  image: z.string().optional(),
  visibility: z.nativeEnum(PostVisibility).optional(),
});

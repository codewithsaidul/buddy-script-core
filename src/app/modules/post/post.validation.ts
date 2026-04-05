import { z } from "zod";
import { PostVisibility } from "./post.interface";

export const createPostZodSchema = z
  .object({
    content: z
      .string()
      .max(2000, "Content cannot exceed 2000 characters")
      .optional(),
    image: z.string().optional(),
    visibility: z.nativeEnum(PostVisibility).default(PostVisibility.PUBLIC),
  })
  .refine((data) => data.content?.trim() || data.image, {
    message: "A post must contain either text content or an image!",
    path: ["content"],
  });

export const updatePostZodSchema = z
  .object({
    content: z
      .string()
      .max(2000, "Content cannot exceed 2000 characters")
      .optional(),
    image: z.string().optional(),
    visibility: z.nativeEnum(PostVisibility).optional(),
  })
  .refine(
    (data) => {
      const hasContent =
        data.content !== undefined ? data.content?.trim() : true;
      const hasImage = data.image !== undefined ? data.image : true;

      return hasContent || hasImage;
    },
    {
      message:
        "Cannot update post to be empty. Please provide content or an image.",
      path: ["content"],
    },
  );

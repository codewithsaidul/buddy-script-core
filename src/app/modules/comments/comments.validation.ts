import { z } from "zod";

export const createCommentZodSchema = z.object({
    post: z.string().optional(),
    text: z.string({ message: "Comment text is required" }).min(1).max(500),
    parentId: z.string().optional().nullable(),
});
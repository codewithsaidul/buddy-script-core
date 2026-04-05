import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { CommentController } from "./comments.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createCommentZodSchema } from "./comments.validation";





const router = Router({ mergeParams: true });


router.post("/", checkAuth(...Object.values(UserRole)), validateRequest(createCommentZodSchema), CommentController.createComment)
router.get("/", checkAuth(...Object.values(UserRole)), CommentController.getCommentsByPost);
router.get("/:commentId/replies", checkAuth(...Object.values(UserRole)), CommentController.getReplies);
router.patch("/:commentId/like", checkAuth(...Object.values(UserRole)), CommentController.toggleCommentLike);
router.delete("/:commentId", checkAuth(...Object.values(UserRole)), CommentController.deleteComment);



export const CommentRoutes = router;
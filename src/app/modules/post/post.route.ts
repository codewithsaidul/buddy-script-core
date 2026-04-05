import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { createPostZodSchema, updatePostZodSchema } from "./post.validation";
import { PostController } from "./post.controller";
import { CommentRoutes } from "../comments/comments.route";

const router = Router();

router.post(
  "/",
  checkAuth(...Object.values(UserRole)),
  multerUpload.single("file"),
  validateRequest(createPostZodSchema),
  PostController.createPost,
);

router.get("/", checkAuth(...Object.values(UserRole)), PostController.getPosts);

router.patch(
  "/:postId",
  checkAuth(...Object.values(UserRole)),
  multerUpload.single("file"),
  validateRequest(updatePostZodSchema),
  PostController.updatePost,
);

router.delete(
  "/:postId",
  checkAuth(...Object.values(UserRole)),
  PostController.deletePost,
);


router.patch(
  "/:postId/like",
  checkAuth(...Object.values(UserRole)),
  PostController.toggleLike,
);


router.use("/:postId/comments", CommentRoutes)

export const PostRoutes = router;

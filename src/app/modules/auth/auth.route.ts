import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { UserRole } from "../user/user.interface";
import { createUserZodSchema } from "../user/user.validation";
import { AuthController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  multerUpload.single("file"),
  validateRequest(createUserZodSchema),
  AuthController.createUser,
);
router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);

router.get("/me", checkAuth(...Object.values(UserRole)), AuthController.getMe);

export const AuthRoutes = router;

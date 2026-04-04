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



/* 

accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMjc5ZDU4NGMzYzUwNDdkYmQ0NDgiLCJlbWFpbCI6InNhaWR1bC5yYW5hQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzUzMTQ5MjksImV4cCI6MTc3NTU3NDEyOX0.bLcQsuCLdDwcXNQQcTCbXjpv4areJ-08XqZ_gfeApUc; Path=/; Secure; HttpOnly; Expires=Tue, 07 Apr 2026 15:02:09 GMT;



refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWQxMjc5ZDU4NGMzYzUwNDdkYmQ0NDgiLCJlbWFpbCI6InNhaWR1bC5yYW5hQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzUzMTQ5MjksImV4cCI6MTc3NzkwNjkyOX0.epVNweIAgLD-zhI8gamm-v5z4GF_4hsfYmRphh2M4C0; Path=/; Secure; HttpOnly; Expires=Mon, 04 May 2026 15:02:09 GMT;

*/
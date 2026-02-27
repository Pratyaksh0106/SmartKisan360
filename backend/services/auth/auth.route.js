import { Router } from "express";
import * as authController from "./auth.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const authRouter = Router();

// ─── Public Routes (no auth required) ───────────────────────────────────────
authRouter.post("/signup", authController.signUp);
authRouter.post("/confirm-signup", authController.confirmSignUp);
authRouter.post("/resend-code", authController.resendCode);
authRouter.post("/signin", authController.signIn);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/refresh-token", authController.refreshToken);

// ─── Protected Routes (auth required) ───────────────────────────────────────
authRouter.get("/profile", authMiddleware, authController.getProfile);
authRouter.post("/signout", authMiddleware, authController.signOut);
authRouter.post("/change-password", authMiddleware, authController.changePassword);

export default authRouter;

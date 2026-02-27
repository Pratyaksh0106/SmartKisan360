import { Router } from "express";
import * as cropController from "./crop.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const cropRouter = Router();

// Protected route — user must be logged in
cropRouter.post("/recommend", authMiddleware, cropController.recommend);

export default cropRouter;

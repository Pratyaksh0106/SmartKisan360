import { Router } from "express";
import * as soilController from "./soil.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const soilRouter = Router();

// Protected route — user must be logged in
soilRouter.post("/analyze-image", authMiddleware, soilController.analyzeImage);

export default soilRouter;

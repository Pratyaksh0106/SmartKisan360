import { Router } from "express";
import * as irrigationController from "./irrigation.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const irrigationRouter = Router();

// Protected route — user must be logged in
irrigationRouter.post("/plan", authMiddleware, irrigationController.plan);

export default irrigationRouter;

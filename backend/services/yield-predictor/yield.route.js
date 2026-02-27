import { Router } from "express";
import * as yieldController from "./yield.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const yieldRouter = Router();

yieldRouter.post("/predict", authMiddleware, yieldController.predict);

export default yieldRouter;

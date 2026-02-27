import { Router } from "express";
import * as riskController from "./risk.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const riskRouter = Router();

riskRouter.post("/analyze", authMiddleware, riskController.analyze);

export default riskRouter;

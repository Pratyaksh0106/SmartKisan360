import { Router } from "express";
import * as priceController from "./price.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const priceRouter = Router();

priceRouter.post("/forecast", authMiddleware, priceController.forecast);

export default priceRouter;

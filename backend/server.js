import "dotenv/config";
import express from "express";
import authRouter from "./services/auth/auth.route.js";
import cropRouter from "./services/crop-recommender/crop.route.js";
import irrigationRouter from "./services/irrigation-planner/irrigation.route.js";
import yieldRouter from "./services/yield-predictor/yield.route.js";
import priceRouter from "./services/price-forecaster/price.route.js";
import riskRouter from "./services/risk-analyzer/risk.route.js";

const server = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ──────────────────────────────────────────────────────────────
server.json = express.json;
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────────────
server.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Kisaan API is running 🌾",
        timestamp: new Date().toISOString(),
    });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
server.use("/auth", authRouter);
server.use("/crop", cropRouter);
server.use("/irrigation", irrigationRouter);
server.use("/yield", yieldRouter);
server.use("/price", priceRouter);
server.use("/risk", riskRouter);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
server.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
    });
});

// ─── Global Error Handler ────────────────────────────────────────────────────
server.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
});

// ─── Start Server ────────────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
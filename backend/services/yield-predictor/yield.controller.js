import * as yieldService from "./yield.service.js";

/**
 * POST /yield/predict
 */
export const predict = async (req, res) => {
    try {
        const { crop, soil, location, season, landArea, farmingPractices, fertilizers } = req.body;

        if (!crop || !crop.name) {
            return res.status(400).json({ success: false, message: "Crop name is required." });
        }
        if (!location || (!location.city && !location.state && (!location.lat || !location.lon))) {
            return res.status(400).json({ success: false, message: "Location is required." });
        }
        if (!soil || !soil.type) {
            return res.status(400).json({ success: false, message: "Soil type is required." });
        }

        const result = await yieldService.predictYield({
            crop, soil, location, season, landArea, farmingPractices, fertilizers,
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Yield prediction error:", error);
        if (error.name === "AccessDeniedException") {
            return res.status(403).json({ success: false, message: "AWS Bedrock access denied." });
        }
        return res.status(500).json({ success: false, message: error.message || "Failed to predict yield." });
    }
};

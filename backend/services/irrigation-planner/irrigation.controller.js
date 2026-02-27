import * as irrigationService from "./irrigation.service.js";

/**
 * POST /irrigation/plan
 * Get AI-powered irrigation plan based on crop, soil, weather, and water data.
 */
export const plan = async (req, res) => {
    try {
        const {
            crop,
            soil,
            location,
            season,
            landArea,
            waterSource,
            currentIrrigation,
        } = req.body;

        // ─── Validation ──────────────────────────────────────────────────
        if (!crop || !crop.name) {
            return res.status(400).json({
                success: false,
                message: "Crop data is required. At minimum, provide crop name.",
            });
        }

        if (!location || (!location.city && !location.state && (!location.lat || !location.lon))) {
            return res.status(400).json({
                success: false,
                message: "Location is required. Provide city/state or lat/lon.",
            });
        }

        if (!soil || !soil.type) {
            return res.status(400).json({
                success: false,
                message: "Soil data is required. At minimum, provide soil type.",
            });
        }

        // ─── Get Irrigation Plan ─────────────────────────────────────────
        const result = await irrigationService.getIrrigationPlan({
            crop,
            soil,
            location,
            season,
            landArea,
            waterSource,
            currentIrrigation,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Irrigation planner error:", error);

        if (error.name === "AccessDeniedException") {
            return res.status(403).json({
                success: false,
                message: "AWS Bedrock access denied. Please enable model access in AWS Console.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to generate irrigation plan.",
        });
    }
};

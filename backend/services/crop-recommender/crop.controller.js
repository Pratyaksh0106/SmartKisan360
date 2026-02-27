import * as cropService from "./crop.service.js";

/**
 * POST /crop/recommend
 * Get AI-powered crop recommendations based on soil, weather, and location data.
 */
export const recommend = async (req, res) => {
    try {
        const {
            soil,
            location,
            season,
            landArea,
            waterAvailability,
            irrigationType,
        } = req.body;

        // ─── Validation ──────────────────────────────────────────────────
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

        // ─── Get Recommendations ─────────────────────────────────────────
        const result = await cropService.getRecommendations({
            soil,
            location,
            season,
            landArea,
            waterAvailability,
            irrigationType,
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Crop recommendation error:", error);

        if (error.name === "AccessDeniedException") {
            return res.status(403).json({
                success: false,
                message: "AWS Bedrock access denied. Please enable model access in AWS Console.",
            });
        }

        if (error.name === "ValidationException") {
            return res.status(400).json({
                success: false,
                message: "Invalid request to AI model. " + error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get crop recommendations.",
        });
    }
};

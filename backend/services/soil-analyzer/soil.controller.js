import * as soilService from "./soil.service.js";

/**
 * POST /soil/analyze-image
 * Analyze a soil image to estimate soil properties (pH, NPK, type, etc.)
 */
export const analyzeImage = async (req, res) => {
    try {
        const { image, mediaType, location } = req.body;

        // ─── Validation ──────────────────────────────────────────────────
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Soil image is required. Provide a base64-encoded image.",
            });
        }

        // Strip data URL prefix if present (e.g., "data:image/jpeg;base64,...")
        let imageBase64 = image;
        let detectedMediaType = mediaType || "image/jpeg";

        if (image.startsWith("data:")) {
            const matches = image.match(/^data:(image\/\w+);base64,(.+)$/);
            if (matches) {
                detectedMediaType = matches[1];
                imageBase64 = matches[2];
            }
        }

        // ─── Analyze ─────────────────────────────────────────────────────
        const result = await soilService.analyzeSoilImage({
            imageBase64,
            mediaType: detectedMediaType,
            location: location || {},
        });

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Soil analysis error:", error);

        if (error.name === "AccessDeniedException") {
            return res.status(403).json({
                success: false,
                message: "AWS Bedrock access denied. Please enable model access in AWS Console.",
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to analyze soil image.",
        });
    }
};

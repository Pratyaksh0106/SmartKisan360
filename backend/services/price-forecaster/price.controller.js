import * as priceService from "./price.service.js";

/**
 * POST /price/forecast
 */
export const forecast = async (req, res) => {
    try {
        const { crop, location, season, quantity, harvestDate, storageAvailable } = req.body;

        if (!crop || !crop.name) {
            return res.status(400).json({ success: false, message: "Crop name is required." });
        }
        if (!location || (!location.city && !location.state && (!location.lat || !location.lon))) {
            return res.status(400).json({ success: false, message: "Location is required." });
        }

        const result = await priceService.forecastPrice({
            crop, location, season, quantity, harvestDate, storageAvailable,
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Price forecast error:", error);
        if (error.name === "AccessDeniedException") {
            return res.status(403).json({ success: false, message: "AWS Bedrock access denied." });
        }
        return res.status(500).json({ success: false, message: error.message || "Failed to forecast price." });
    }
};

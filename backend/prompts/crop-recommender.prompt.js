/**
 * System prompt for the crop recommender AI.
 * This instructs the LLM on its role, expertise, and output format.
 */
export const CROP_RECOMMENDER_SYSTEM_PROMPT = `You are "Smart Kisaan AI", an expert agricultural advisor for Indian farmers.
Your job is to recommend the best crops to grow based on the farmer's soil, weather, location, and season data.

## Your Expertise:
- Indian agriculture, cropping patterns, and regional farming practices
- Soil science (pH, NPK levels, soil types)
- Climate and weather impact on crops
- Kharif, Rabi, and Zaid crop seasons
- Water requirements and irrigation methods
- Market demand and profitability of crops in India

## Rules:
1. Always recommend 3-5 crops, ranked by suitability
2. Consider the specific Indian state/region and its traditional crops
3. Factor in current weather conditions if available
4. Provide practical, actionable advice a farmer can use immediately
5. Include estimated yield and growing duration
6. Mention water requirements for each crop
7. If data is incomplete, make reasonable assumptions for Indian agriculture and mention them
8. Respond ONLY in the JSON format specified below — no extra text

## Response Format (strict JSON):
{
  "recommendations": [
    {
      "rank": 1,
      "cropName": "Crop Name",
      "cropNameHindi": "फसल का नाम",
      "suitabilityScore": 95,
      "season": "Kharif/Rabi/Zaid",
      "reasonsToGrow": ["reason 1", "reason 2", "reason 3"],
      "estimatedYield": "X quintals per hectare",
      "growingDuration": "X-Y days",
      "waterRequirement": "low/moderate/high - X mm per season",
      "sowingMonth": "Month name",
      "harvestMonth": "Month name",
      "tips": ["practical tip 1", "practical tip 2"]
    }
  ],
  "soilAnalysis": "Brief analysis of the soil condition and what it's best suited for",
  "weatherImpact": "How current weather affects crop selection",
  "generalAdvice": "Any additional advice for the farmer"
}`;

/**
 * Build the user message with all available data for the crop recommender.
 */
export const buildCropRecommenderPrompt = ({ soil, location, season, weather, landArea, waterAvailability, irrigationType }) => {
    let prompt = `## Farmer's Data:\n\n`;

    // Location info
    prompt += `### Location:\n`;
    if (location.city) prompt += `- City/Village: ${location.city}\n`;
    if (location.state) prompt += `- State: ${location.state}\n`;
    if (location.district) prompt += `- District: ${location.district}\n`;
    if (location.lat && location.lon) prompt += `- Coordinates: ${location.lat}, ${location.lon}\n`;
    prompt += `\n`;

    // Soil info
    prompt += `### Soil Data:\n`;
    if (soil.type) prompt += `- Soil Type: ${soil.type}\n`;
    if (soil.ph !== undefined && soil.ph !== null) prompt += `- Soil pH: ${soil.ph}\n`;
    if (soil.nitrogen !== undefined && soil.nitrogen !== null) prompt += `- Nitrogen (N): ${soil.nitrogen} kg/ha\n`;
    if (soil.phosphorus !== undefined && soil.phosphorus !== null) prompt += `- Phosphorus (P): ${soil.phosphorus} kg/ha\n`;
    if (soil.potassium !== undefined && soil.potassium !== null) prompt += `- Potassium (K): ${soil.potassium} kg/ha\n`;
    if (soil.organicCarbon) prompt += `- Organic Carbon: ${soil.organicCarbon}%\n`;
    prompt += `\n`;

    // Season
    if (season) {
        prompt += `### Season:\n- Planned season: ${season}\n\n`;
    }

    // Land
    if (landArea) {
        prompt += `### Land:\n- Area: ${landArea}\n`;
    }

    // Water
    if (waterAvailability) {
        prompt += `- Water Availability: ${waterAvailability}\n`;
    }
    if (irrigationType) {
        prompt += `- Irrigation Type: ${irrigationType}\n`;
    }
    prompt += `\n`;

    // Weather (auto-fetched)
    if (weather) {
        prompt += `### Current Weather (live data):\n`;
        prompt += `- Temperature: ${weather.temperature}°C (Feels like: ${weather.feelsLike}°C)\n`;
        prompt += `- Humidity: ${weather.humidity}%\n`;
        prompt += `- Weather: ${weather.description}\n`;
        prompt += `- Wind Speed: ${weather.windSpeed} m/s\n`;
        prompt += `- Cloud Cover: ${weather.clouds}%\n`;
        prompt += `- Recent Rainfall: ${weather.rainfall} mm\n`;
        if (weather.locationName) prompt += `- Weather Station: ${weather.locationName}\n`;
        prompt += `\n`;
    }

    prompt += `Based on ALL the above data, recommend the best crops for this farmer. Respond in the specified JSON format only.`;

    return prompt;
};

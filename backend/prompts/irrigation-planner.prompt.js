/**
 * System prompt for the irrigation planner AI.
 */
export const IRRIGATION_PLANNER_SYSTEM_PROMPT = `You are "Smart Kisaan AI", an expert irrigation and water management advisor for Indian farmers.
Your job is to create a detailed irrigation plan based on the farmer's crop, soil, weather, location, and water source data.

## Your Expertise:
- Indian agriculture irrigation practices (flood, drip, sprinkler, furrow, etc.)
- Water requirement calculation for different crops at different growth stages
- Soil moisture management and water retention properties
- Monsoon patterns and rainfall-based irrigation scheduling
- Groundwater and canal water management in India
- Water conservation techniques suitable for Indian farming
- Government schemes related to irrigation (PM Krishi Sinchayee Yojana, etc.)

## Rules:
1. Create a week-by-week or stage-by-stage irrigation schedule
2. Consider the Indian monsoon season and local rainfall patterns
3. Account for soil type and its water retention capacity
4. Factor in the crop's growth stages (germination, vegetative, flowering, maturity)
5. Include water-saving tips practical for Indian farmers
6. Mention cost-effective irrigation methods
7. If data is incomplete, make reasonable assumptions for Indian conditions and mention them
8. Respond ONLY in the JSON format specified below — no extra text

## Response Format (strict JSON):
{
  "irrigationPlan": {
    "cropName": "Crop Name",
    "totalWaterRequired": "X mm for entire season",
    "irrigationMethod": "Recommended method",
    "schedule": [
      {
        "stage": "Growth stage name",
        "weekRange": "Week 1-2",
        "daysFromSowing": "0-14",
        "waterPerIrrigation": "X mm",
        "frequencyPerWeek": 2,
        "criticalNotes": "Important note for this stage"
      }
    ]
  },
  "waterSavingTips": [
    "Practical water saving tip 1",
    "Practical water saving tip 2"
  ],
  "soilMoistureGuide": {
    "optimalMoisture": "X% for this crop",
    "checkMethod": "How farmer can check soil moisture",
    "waterloggingRisk": "low/medium/high",
    "droughtStress signs": "Visual signs to watch for"
  },
  "irrigationCostEstimate": {
    "method": "Recommended method",
    "setupCost": "Approximate range in INR",
    "waterCostPerSeason": "Approximate range in INR",
    "governmentSubsidy": "Available scheme details"
  },
  "seasonalAdvice": "Advice considering current season and monsoon",
  "generalAdvice": "Any additional advice for the farmer"
}`;

/**
 * Build the user message with all available data for the irrigation planner.
 */
export const buildIrrigationPlannerPrompt = ({ crop, soil, location, season, weather, landArea, waterSource, currentIrrigation }) => {
    let prompt = `## Farmer's Data:\n\n`;

    // Crop info
    prompt += `### Crop:\n`;
    if (crop.name) prompt += `- Crop: ${crop.name}\n`;
    if (crop.growthStage) prompt += `- Current Growth Stage: ${crop.growthStage}\n`;
    if (crop.sowingDate) prompt += `- Sowing Date: ${crop.sowingDate}\n`;
    if (crop.variety) prompt += `- Variety: ${crop.variety}\n`;
    prompt += `\n`;

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
    if (soil.texture) prompt += `- Soil Texture: ${soil.texture}\n`;
    if (soil.drainage) prompt += `- Drainage: ${soil.drainage}\n`;
    prompt += `\n`;

    // Season
    if (season) {
        prompt += `### Season:\n- Current Season: ${season}\n\n`;
    }

    // Land
    if (landArea) {
        prompt += `### Land Area: ${landArea}\n\n`;
    }

    // Water source
    if (waterSource) {
        prompt += `### Water Source:\n`;
        if (waterSource.type) prompt += `- Type: ${waterSource.type}\n`;
        if (waterSource.availability) prompt += `- Availability: ${waterSource.availability}\n`;
        if (waterSource.quality) prompt += `- Quality: ${waterSource.quality}\n`;
        prompt += `\n`;
    }

    // Current irrigation
    if (currentIrrigation) {
        prompt += `### Current Irrigation Practice:\n`;
        if (currentIrrigation.method) prompt += `- Method: ${currentIrrigation.method}\n`;
        if (currentIrrigation.frequency) prompt += `- Frequency: ${currentIrrigation.frequency}\n`;
        if (currentIrrigation.issues) prompt += `- Issues: ${currentIrrigation.issues}\n`;
        prompt += `\n`;
    }

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

    prompt += `Based on ALL the above data, create a detailed irrigation plan for this farmer. Respond in the specified JSON format only.`;

    return prompt;
};

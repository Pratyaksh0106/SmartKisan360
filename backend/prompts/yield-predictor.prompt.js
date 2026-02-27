/**
 * System prompt for the yield predictor AI.
 */
export const YIELD_PREDICTOR_SYSTEM_PROMPT = `You are "Smart Kisaan AI", an expert crop yield prediction advisor for Indian farmers.
Your job is to predict the expected crop yield based on the farmer's land, soil, weather, farming practices, and historical data.

## Your Expertise:
- Indian crop yield patterns across different states and agro-climatic zones
- Impact of soil quality, fertilizers, and pesticides on yield
- Weather influence on crop productivity (rainfall, temperature, humidity)
- Best farming practices to maximize yield in Indian conditions
- Historical yield data for major Indian crops (rice, wheat, sugarcane, cotton, pulses, etc.)
- Government data on average yields per hectare across Indian states

## Rules:
1. Provide a realistic yield prediction range (minimum, expected, maximum)
2. Base predictions on Indian agricultural data and conditions
3. Consider regional yield averages for the specific state
4. Factor in soil quality, weather, and farming practices
5. Identify key factors that could increase or decrease the predicted yield
6. Provide actionable tips to achieve maximum yield
7. If data is incomplete, use Indian agricultural averages and mention assumptions
8. Respond ONLY in the JSON format specified below — no extra text

## Response Format (strict JSON):
{
  "yieldPrediction": {
    "cropName": "Crop Name",
    "cropNameHindi": "फसल का नाम",
    "predictedYield": {
      "minimum": "X quintals/hectare",
      "expected": "Y quintals/hectare",
      "maximum": "Z quintals/hectare"
    },
    "confidenceLevel": "high/medium/low",
    "stateAverage": "Average yield in this state",
    "nationalAverage": "National average yield"
  },
  "yieldFactors": [
    {
      "factor": "Factor name",
      "impact": "positive/negative/neutral",
      "severity": "high/medium/low",
      "explanation": "How this factor affects yield"
    }
  ],
  "yieldBoostTips": [
    {
      "tip": "Actionable advice",
      "potentialIncrease": "X% increase possible",
      "difficulty": "easy/moderate/hard",
      "costEstimate": "Low/Medium/High"
    }
  ],
  "fertilizerRecommendation": {
    "nitrogen": "X kg/hectare",
    "phosphorus": "X kg/hectare",
    "potassium": "X kg/hectare",
    "organic": "Recommended organic manure",
    "applicationSchedule": "When to apply"
  },
  "riskFactors": ["Risk 1", "Risk 2"],
  "harvestTimeline": {
    "expectedHarvestDate": "Month/Week",
    "maturitySigns": ["Sign 1", "Sign 2"]
  },
  "generalAdvice": "Overall advice for the farmer"
}`;

/**
 * Build the user message for yield prediction.
 */
export const buildYieldPredictorPrompt = ({ crop, soil, location, season, weather, landArea, farmingPractices, fertilizers }) => {
    let prompt = `## Farmer's Data:\n\n`;

    // Crop
    prompt += `### Crop:\n`;
    if (crop.name) prompt += `- Crop: ${crop.name}\n`;
    if (crop.variety) prompt += `- Variety: ${crop.variety}\n`;
    if (crop.sowingDate) prompt += `- Sowing Date: ${crop.sowingDate}\n`;
    if (crop.growthStage) prompt += `- Current Growth Stage: ${crop.growthStage}\n`;
    prompt += `\n`;

    // Location
    prompt += `### Location:\n`;
    if (location.city) prompt += `- City/Village: ${location.city}\n`;
    if (location.state) prompt += `- State: ${location.state}\n`;
    if (location.district) prompt += `- District: ${location.district}\n`;
    if (location.lat && location.lon) prompt += `- Coordinates: ${location.lat}, ${location.lon}\n`;
    prompt += `\n`;

    // Soil
    prompt += `### Soil Data:\n`;
    if (soil.type) prompt += `- Soil Type: ${soil.type}\n`;
    if (soil.ph !== undefined && soil.ph !== null) prompt += `- Soil pH: ${soil.ph}\n`;
    if (soil.nitrogen !== undefined) prompt += `- Nitrogen (N): ${soil.nitrogen} kg/ha\n`;
    if (soil.phosphorus !== undefined) prompt += `- Phosphorus (P): ${soil.phosphorus} kg/ha\n`;
    if (soil.potassium !== undefined) prompt += `- Potassium (K): ${soil.potassium} kg/ha\n`;
    if (soil.organicCarbon) prompt += `- Organic Carbon: ${soil.organicCarbon}%\n`;
    prompt += `\n`;

    if (season) prompt += `### Season: ${season}\n\n`;
    if (landArea) prompt += `### Land Area: ${landArea}\n\n`;

    // Farming practices
    if (farmingPractices) {
        prompt += `### Farming Practices:\n`;
        if (farmingPractices.irrigationType) prompt += `- Irrigation: ${farmingPractices.irrigationType}\n`;
        if (farmingPractices.tillage) prompt += `- Tillage: ${farmingPractices.tillage}\n`;
        if (farmingPractices.pesticides) prompt += `- Pesticide Use: ${farmingPractices.pesticides}\n`;
        if (farmingPractices.previousCrop) prompt += `- Previous Crop: ${farmingPractices.previousCrop}\n`;
        prompt += `\n`;
    }

    // Fertilizers
    if (fertilizers) {
        prompt += `### Fertilizers Used:\n`;
        if (fertilizers.urea) prompt += `- Urea: ${fertilizers.urea}\n`;
        if (fertilizers.dap) prompt += `- DAP: ${fertilizers.dap}\n`;
        if (fertilizers.mop) prompt += `- MOP: ${fertilizers.mop}\n`;
        if (fertilizers.organic) prompt += `- Organic: ${fertilizers.organic}\n`;
        prompt += `\n`;
    }

    // Weather
    if (weather) {
        prompt += `### Current Weather (live data):\n`;
        prompt += `- Temperature: ${weather.temperature}°C (Feels like: ${weather.feelsLike}°C)\n`;
        prompt += `- Humidity: ${weather.humidity}%\n`;
        prompt += `- Weather: ${weather.description}\n`;
        prompt += `- Wind Speed: ${weather.windSpeed} m/s\n`;
        prompt += `- Recent Rainfall: ${weather.rainfall} mm\n`;
        prompt += `\n`;
    }

    prompt += `Based on ALL the above data, predict the crop yield for this farmer. Respond in the specified JSON format only.`;
    return prompt;
};

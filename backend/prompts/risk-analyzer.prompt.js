/**
 * System prompt for the risk analyzer AI.
 */
export const RISK_ANALYZER_SYSTEM_PROMPT = `You are "Smart Kisaan AI", an expert agricultural risk assessment advisor for Indian farmers.
Your job is to analyze all potential risks to the farmer's crop and provide mitigation strategies.

## Your Expertise:
- Pest and disease risks for Indian crops (region-specific)
- Weather-related risks (drought, flood, hailstorm, unseasonal rain, heat waves)
- Market risks (price crashes, demand shifts, oversupply)
- Soil degradation and nutrient deficiency risks
- Water scarcity and irrigation failure risks
- Government policy changes affecting farming
- Crop insurance schemes (PMFBY - Pradhan Mantri Fasal Bima Yojana)
- Climate change impact on Indian agriculture
- Post-harvest losses and storage risks

## Rules:
1. Analyze ALL categories of risk: pest/disease, weather, market, soil, water, financial
2. Rate each risk by severity and likelihood
3. Provide specific, actionable mitigation strategies for each risk
4. Consider the specific Indian state/region and its known risks
5. Mention relevant crop insurance and government protection schemes
6. Factor in current weather conditions
7. Include early warning signs the farmer should watch for
8. If data is incomplete, assess based on common risks for the crop/region and mention assumptions
9. Respond ONLY in the JSON format specified below — no extra text

## Response Format (strict JSON):
{
  "riskAssessment": {
    "overallRiskLevel": "low/moderate/high/critical",
    "riskScore": 65,
    "cropName": "Crop Name",
    "cropNameHindi": "फसल का नाम"
  },
  "risks": [
    {
      "category": "pest/disease/weather/market/soil/water/financial",
      "riskName": "Specific risk name",
      "riskNameHindi": "जोखिम का नाम",
      "severity": "low/medium/high/critical",
      "likelihood": "unlikely/possible/likely/very_likely",
      "timeframe": "immediate/short_term/medium_term/long_term",
      "description": "What could happen",
      "earlyWarningSigns": ["Sign 1", "Sign 2"],
      "mitigation": [
        {
          "action": "What to do",
          "cost": "Low/Medium/High",
          "effectiveness": "high/medium/low"
        }
      ]
    }
  ],
  "insuranceAdvice": {
    "recommended": true,
    "scheme": "PMFBY or relevant scheme",
    "coverage": "What it covers",
    "premium": "Approximate premium",
    "enrollmentDeadline": "When to enroll",
    "howToEnroll": "Steps to enroll"
  },
  "emergencyPlan": {
    "pestOutbreak": "Immediate steps",
    "drought": "Immediate steps",
    "flood": "Immediate steps",
    "pricecrash": "Immediate steps"
  },
  "seasonalAlerts": ["Alert 1 for this season", "Alert 2"],
  "generalAdvice": "Overall risk management advice"
}`;

/**
 * Build the user message for risk analysis.
 */
export const buildRiskAnalyzerPrompt = ({ crop, soil, location, season, weather, landArea, farmingPractices, concerns }) => {
    let prompt = `## Farmer's Data:\n\n`;

    // Crop
    prompt += `### Crop:\n`;
    if (crop.name) prompt += `- Crop: ${crop.name}\n`;
    if (crop.variety) prompt += `- Variety: ${crop.variety}\n`;
    if (crop.sowingDate) prompt += `- Sowing Date: ${crop.sowingDate}\n`;
    if (crop.growthStage) prompt += `- Current Growth Stage: ${crop.growthStage}\n`;
    if (crop.investmentSoFar) prompt += `- Investment So Far: ₹${crop.investmentSoFar}\n`;
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
    if (soil.drainage) prompt += `- Drainage: ${soil.drainage}\n`;
    prompt += `\n`;

    if (season) prompt += `### Season: ${season}\n\n`;
    if (landArea) prompt += `### Land Area: ${landArea}\n\n`;

    // Farming practices
    if (farmingPractices) {
        prompt += `### Farming Practices:\n`;
        if (farmingPractices.irrigationType) prompt += `- Irrigation: ${farmingPractices.irrigationType}\n`;
        if (farmingPractices.pesticides) prompt += `- Pesticide Use: ${farmingPractices.pesticides}\n`;
        if (farmingPractices.insurance) prompt += `- Has Crop Insurance: ${farmingPractices.insurance}\n`;
        prompt += `\n`;
    }

    // Specific concerns
    if (concerns && concerns.length > 0) {
        prompt += `### Farmer's Specific Concerns:\n`;
        concerns.forEach((c) => (prompt += `- ${c}\n`));
        prompt += `\n`;
    }

    // Weather
    if (weather) {
        prompt += `### Current Weather (live data):\n`;
        prompt += `- Temperature: ${weather.temperature}°C (Feels like: ${weather.feelsLike}°C)\n`;
        prompt += `- Humidity: ${weather.humidity}%\n`;
        prompt += `- Weather: ${weather.description}\n`;
        prompt += `- Wind Speed: ${weather.windSpeed} m/s\n`;
        prompt += `- Cloud Cover: ${weather.clouds}%\n`;
        prompt += `- Recent Rainfall: ${weather.rainfall} mm\n`;
        prompt += `\n`;
    }

    prompt += `Based on ALL the above data, perform a comprehensive risk analysis for this farmer. Respond in the specified JSON format only.`;
    return prompt;
};

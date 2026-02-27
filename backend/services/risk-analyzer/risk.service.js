import { invokeBedrock } from "./risk.repository.js";
import { getWeatherData } from "../../utils/weather.js";
import {
    RISK_ANALYZER_SYSTEM_PROMPT,
    buildRiskAnalyzerPrompt,
} from "../../prompts/risk-analyzer.prompt.js";

export const analyzeRisks = async ({
    crop,
    soil,
    location,
    season,
    landArea,
    farmingPractices,
    concerns,
}) => {
    let weather = null;
    try {
        weather = await getWeatherData({
            lat: location.lat,
            lon: location.lon,
            city: location.city,
            state: location.state,
        });
    } catch (error) {
        console.warn("Could not fetch weather data:", error.message);
    }

    const userMessage = buildRiskAnalyzerPrompt({
        crop, soil, location, season, weather, landArea, farmingPractices, concerns,
    });

    const aiResponse = await invokeBedrock(RISK_ANALYZER_SYSTEM_PROMPT, userMessage);

    let analysis;
    try {
        const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        analysis = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned an invalid response. Please try again.");
    }

    return {
        ...analysis,
        weatherData: weather,
        inputSummary: {
            crop: crop.name,
            location: location.city || location.state || `${location.lat}, ${location.lon}`,
            soilType: soil.type,
            season: season || "Not specified",
        },
    };
};

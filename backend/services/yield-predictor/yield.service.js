import { invokeBedrock } from "./yield.repository.js";
import { getWeatherData } from "../../utils/weather.js";
import {
    YIELD_PREDICTOR_SYSTEM_PROMPT,
    buildYieldPredictorPrompt,
} from "../../prompts/yield-predictor.prompt.js";

export const predictYield = async ({
    crop,
    soil,
    location,
    season,
    landArea,
    farmingPractices,
    fertilizers,
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

    const userMessage = buildYieldPredictorPrompt({
        crop, soil, location, season, weather, landArea, farmingPractices, fertilizers,
    });

    const aiResponse = await invokeBedrock(YIELD_PREDICTOR_SYSTEM_PROMPT, userMessage);

    let prediction;
    try {
        const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        prediction = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned an invalid response. Please try again.");
    }

    return {
        ...prediction,
        weatherData: weather,
        inputSummary: {
            crop: crop.name,
            location: location.city || location.state || `${location.lat}, ${location.lon}`,
            soilType: soil.type,
            season: season || "Not specified",
        },
    };
};

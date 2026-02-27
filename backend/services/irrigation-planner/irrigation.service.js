import { invokeBedrock } from "./irrigation.repository.js";
import { getWeatherData } from "../../utils/weather.js";
import {
    IRRIGATION_PLANNER_SYSTEM_PROMPT,
    buildIrrigationPlannerPrompt,
} from "../../prompts/irrigation-planner.prompt.js";

/**
 * Get a detailed irrigation plan based on crop, soil, location, and water data.
 * Automatically enriches the request with real-time weather data.
 */
export const getIrrigationPlan = async ({
    crop,
    soil,
    location,
    season,
    landArea,
    waterSource,
    currentIrrigation,
}) => {
    // Step 1: Fetch real-time weather data
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

    // Step 2: Build the prompt
    const userMessage = buildIrrigationPlannerPrompt({
        crop,
        soil,
        location,
        season,
        weather,
        landArea,
        waterSource,
        currentIrrigation,
    });

    // Step 3: Call AWS Bedrock (Claude)
    const aiResponse = await invokeBedrock(
        IRRIGATION_PLANNER_SYSTEM_PROMPT,
        userMessage
    );

    // Step 4: Parse the JSON response
    let plan;
    try {
        const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        plan = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned an invalid response. Please try again.");
    }

    return {
        ...plan,
        weatherData: weather,
        inputSummary: {
            crop: crop.name,
            location: location.city || location.state || `${location.lat}, ${location.lon}`,
            soilType: soil.type,
            season: season || "Not specified",
        },
    };
};

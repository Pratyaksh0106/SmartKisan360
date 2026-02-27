import { invokeBedrock } from "./crop.repository.js";
import { getWeatherData } from "../../utils/weather.js";
import {
    CROP_RECOMMENDER_SYSTEM_PROMPT,
    buildCropRecommenderPrompt,
} from "../../prompts/crop-recommender.prompt.js";

/**
 * Get crop recommendations based on soil, location, season, and weather data.
 * Automatically enriches the request with real-time weather data.
 */
export const getRecommendations = async ({
    soil,
    location,
    season,
    landArea,
    waterAvailability,
    irrigationType,
}) => {
    // Step 1: Fetch real-time weather data for the location
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
        // Continue without weather — AI will still give recommendations
    }

    // Step 2: Build the prompt with all available data
    const userMessage = buildCropRecommenderPrompt({
        soil,
        location,
        season,
        weather,
        landArea,
        waterAvailability,
        irrigationType,
    });

    // Step 3: Call AWS Bedrock (Claude) for AI recommendations
    const aiResponse = await invokeBedrock(
        CROP_RECOMMENDER_SYSTEM_PROMPT,
        userMessage
    );

    // Step 4: Parse the JSON response from AI
    let recommendations;
    try {
        // Extract JSON from response (handle markdown code blocks if any)
        const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        recommendations = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned an invalid response. Please try again.");
    }

    return {
        ...recommendations,
        weatherData: weather,
        inputSummary: {
            location: location.city || location.state || `${location.lat}, ${location.lon}`,
            soilType: soil.type,
            season: season || "Not specified",
        },
    };
};

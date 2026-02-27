import { invokeBedrock } from "./price.repository.js";
import { getWeatherData } from "../../utils/weather.js";
import {
    PRICE_FORECASTER_SYSTEM_PROMPT,
    buildPriceForecasterPrompt,
} from "../../prompts/price-forecaster.prompt.js";

export const forecastPrice = async ({
    crop,
    location,
    season,
    quantity,
    harvestDate,
    storageAvailable,
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

    const userMessage = buildPriceForecasterPrompt({
        crop, location, season, quantity, harvestDate, storageAvailable, weather,
    });

    const aiResponse = await invokeBedrock(PRICE_FORECASTER_SYSTEM_PROMPT, userMessage);

    let forecast;
    try {
        const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        forecast = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned an invalid response. Please try again.");
    }

    return {
        ...forecast,
        weatherData: weather,
        inputSummary: {
            crop: crop.name,
            location: location.city || location.state || `${location.lat}, ${location.lon}`,
            season: season || "Not specified",
        },
    };
};

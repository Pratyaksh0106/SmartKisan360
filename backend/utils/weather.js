const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch current weather data for a given location.
 * Accepts either { lat, lon } or { city, state }.
 */
export const getWeatherData = async ({ lat, lon, city, state }) => {
    let url;

    if (lat && lon) {
        url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else if (city) {
        const query = state ? `${city},${state},IN` : `${city},IN`;
        url = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
        throw new Error("Either lat/lon or city is required for weather data.");
    }

    const response = await fetch(url);

    if (!response.ok) {
        console.error("Weather API error:", response.status, await response.text());
        return null; // Return null so the feature still works without weather
    }

    const data = await response.json();

    return {
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        description: data.weather[0]?.description,
        windSpeed: data.wind.speed,
        clouds: data.clouds.all,
        rainfall: data.rain?.["1h"] || data.rain?.["3h"] || 0,
        locationName: data.name,
    };
};

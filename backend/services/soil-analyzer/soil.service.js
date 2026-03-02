import { invokeBedrockWithImage } from "../../utils/bedrock.js";
import {
    SOIL_ANALYZER_SYSTEM_PROMPT,
    buildSoilAnalyzerPrompt,
} from "../../prompts/soil-analyzer.prompt.js";

/**
 * Analyze a soil image using AI to estimate soil properties.
 */
export const analyzeSoilImage = async ({ imageBase64, mediaType, location }) => {
    // Build the prompt with optional location context
    const userMessage = buildSoilAnalyzerPrompt({ location });

    // Call AWS Bedrock (Claude) with the image
    const aiResponse = await invokeBedrockWithImage(
        SOIL_ANALYZER_SYSTEM_PROMPT,
        userMessage,
        imageBase64,
        mediaType
    );

    // Parse the JSON response from AI
    let analysis;
    try {
        const jsonStr = aiResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        analysis = JSON.parse(jsonStr);
    } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new Error("AI returned an invalid response. Please try again.");
    }

    return analysis;
};

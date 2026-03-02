/**
 * Soil Image Analyzer — AI Prompt
 * Analyzes a soil image to estimate soil properties.
 */

export const SOIL_ANALYZER_SYSTEM_PROMPT = `You are an expert agronomist and soil scientist specializing in Indian soils.
You analyze soil images to estimate soil properties. Based on the visual characteristics 
(color, texture, moisture, granularity, organic matter visibility, etc.), provide your best 
estimates for the soil properties.

IMPORTANT RULES:
1. Always respond with valid JSON only — no markdown, no explanation outside JSON.
2. Base your analysis on visual cues: darker soil = more organic matter, reddish = laterite/iron-rich, 
   sandy texture = sandy soil, sticky/smooth = clay, etc.
3. Provide realistic ranges typical for Indian agricultural soils.
4. If the image is not clearly a soil image, still try your best but note low confidence.
5. All numeric values should be reasonable agricultural ranges.`;

export const buildSoilAnalyzerPrompt = ({ location }) => {
    let prompt = `Analyze this soil image and provide estimated soil properties.

RESPOND WITH THIS EXACT JSON STRUCTURE:
{
    "soilType": "<detected soil type, e.g., Alluvial, Black/Regur, Red, Laterite, Sandy, Clay, Loamy, etc.>",
    "ph": <estimated pH value as number, e.g., 6.5>,
    "nitrogen": <estimated nitrogen in kg/ha as number, e.g., 240>,
    "phosphorus": <estimated phosphorus in kg/ha as number, e.g., 18>,
    "potassium": <estimated potassium in kg/ha as number, e.g., 200>,
    "organicMatter": "<estimated organic matter percentage, e.g., 2.5%>",
    "moisture": "<estimated moisture level, e.g., Moderate>",
    "texture": "<detected texture, e.g., Sandy Loam, Clay Loam, etc.>",
    "color": "<observed color description>",
    "confidence": "<Low/Medium/High - your confidence in this analysis>",
    "observations": "<brief observations about the soil from the image>",
    "recommendations": "<brief soil improvement recommendations>"
}`;

    if (location) {
        prompt += `\n\nLocation context (use this to refine estimates):`;
        if (location.state) prompt += `\n- State: ${location.state}`;
        if (location.city) prompt += `\n- City/District: ${location.city}`;
    }

    prompt += `\n\nRespond ONLY with the JSON object. No other text.`;
    return prompt;
};

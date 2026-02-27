const BEDROCK_API_KEY = process.env.BEDROCK_API_KEY;
const BEDROCK_REGION = process.env.BEDROCK_REGION || "us-east-1";
const MODEL_ID = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0";

/**
 * Invoke AWS Bedrock (Claude) using Bedrock API Key as Bearer token.
 * Shared utility used by all AI-powered features.
 */
export const invokeBedrock = async (systemPrompt, userMessage) => {
    const payload = {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
            {
                role: "user",
                content: userMessage,
            },
        ],
    };

    const url = `https://bedrock-runtime.${BEDROCK_REGION}.amazonaws.com/model/${encodeURIComponent(MODEL_ID)}/invoke`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${BEDROCK_API_KEY}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Bedrock API error:", response.status, errorText);
        throw new Error(`Bedrock API error (${response.status}): ${errorText}`);
    }

    const responseBody = await response.json();

    if (responseBody.content && responseBody.content[0]) {
        return responseBody.content[0].text;
    }

    if (responseBody.completion) {
        return responseBody.completion;
    }

    throw new Error("Unexpected response format from Bedrock API");
};

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAi = () => {
    // NOTE: A new instance is created for each call to ensure the most up-to-date API key is used.
    // This is crucial for features like Veo video generation where the user might select a new key.
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY environment variable not set");
    }
    return new GoogleGenAI({ apiKey });
};

export const getReviewResponse = async (review: string): Promise<string> => {
    try {
        const ai = getAi();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are an expert in customer relations for medical clinics. A user has provided a negative review. Draft a professional, empathetic, and constructive response. Do not admit fault but acknowledge their experience and offer to discuss the matter offline to find a resolution. The response should be concise. Here is the review: "${review}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting review response from Gemini:", error);
        return "An error occurred while generating the response.";
    }
};

export const getOptimizedContent = async (description: string): Promise<string> => {
    try {
        const ai = getAi();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a marketing expert specializing in medical tourism and cosmetic procedures. A user has provided a description for their hair transplant clinic. Analyze it and provide an optimized version that is more compelling, trustworthy, and highlights key benefits for potential patients. Also, provide a bulleted list of your suggested changes and the reasoning behind them. The output should be in Markdown format. Here is the original description: "${description}"`,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting optimized content from Gemini:", error);
        return "An error occurred while generating the optimized content.";
    }
};

export const getOptimizedDescriptionOnly = async (description: string): Promise<string> => {
    try {
        const ai = getAi();
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `You are a marketing expert specializing in medical tourism and cosmetic procedures. A user has provided a description for their hair transplant clinic. Rewrite and optimize it to be more compelling, trustworthy, and highlight key benefits for potential patients. IMPORTANT: Return ONLY the rewritten description text. Do not include any of your own commentary, headings, explanations, or the original text. Just the final, optimized description. Here is the original description: "${description}"`,
        });
        let text = response.text;
        // The Gemini API sometimes wraps markdown in ```markdown ... ```, let's strip it.
        text = text.replace(/^```markdown\n/, '').replace(/\n```$/, '');
        return text.trim();
    } catch (error) {
        console.error("Error getting optimized description from Gemini:", error);
        return "An error occurred while generating the optimized content.";
    }
};

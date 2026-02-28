import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getStrategyAdvice = async (userPrompt: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are the "WebManufaktur Strategic Consultant". We are a high-end web design and content agency in Berlin (WebManufaktur Berlin).

      User input: "${userPrompt}"

      Your goal: The user will describe their business or a content need. You will provide a punchy, high-value strategic tip, a potential slogan, or a content hook.
      Keep the tone professional, modern, 'Berlin-cool' (minimalist and direct), and authoritative.
      Keep the response under 60 words.`,
    });
    return response.text || "Analyzing market data...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Verbindung zum KI-Berater fehlgeschlagen. Bitte stelle sicher, dass ein gültiger API-Key hinterlegt ist.";
  }
};
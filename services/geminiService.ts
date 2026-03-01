/// <reference types="vite/client" />

// Use VITE_ env var if available, otherwise fallback to the user-provided key.
// Note: Hardcoding or exposing API keys in frontend code is typically a security risk.
// Since this is required to run locally without a backend, we expose it here.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const getStrategyAdvice = async (userPrompt: string): Promise<string> => {
  if (!API_KEY) {
    console.error('API KEY IS MISSING IN import.meta.env');
    throw new Error('API key is missing.');
  }
  console.log('API Key loaded. Length:', API_KEY.length, 'Starts with:', API_KEY.substring(0, 5));

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const payload = {
    systemInstruction: {
      parts: [
        {
          text: "You are the 'WebManufaktur Strategic Consultant'. We are a high-end web design and content agency in Berlin (WebManufaktur Berlin). The user will describe their business or a content need. You will provide a punchy, high-value strategic tip, a potential slogan, or a content hook. Keep the tone professional, modern, 'Berlin-cool' (minimalist and direct), and authoritative. Keep the response under 60 words."
        }
      ]
    },
    contents: [
      {
        parts: [{ text: userPrompt }]
      }
    ],
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error((errorData.error && errorData.error.message) || 'API request failed');
    }

    const data = await response.json();

    // Extract the text from the response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text || 'Analyzing market data...';
    } else {
      throw new Error('Unexpected response format from AI.');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

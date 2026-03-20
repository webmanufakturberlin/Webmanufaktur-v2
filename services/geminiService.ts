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

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

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
      const msg = (errorData.error && errorData.error.message) || '';
      if (response.status === 400) throw new Error(`[400 Bad Request] ${msg}`);
      if (response.status === 401) throw new Error(`[401 Unauthorized] API-Key ungültig oder nicht gesetzt. ${msg}`);
      if (response.status === 403) throw new Error(`[403 Forbidden] API-Key hat keine Berechtigung. ${msg}`);
      if (response.status === 429) throw new Error(`[429 Rate Limit] Zu viele Anfragen. ${msg}`);
      if (response.status === 500) throw new Error(`[500 Server Error] Google-Server-Fehler. ${msg}`);
      throw new Error(`[HTTP ${response.status}] ${msg}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text || 'Analyzing market data...';
    } else {
      throw new Error(`[Unexpected Response] ${JSON.stringify(data).substring(0, 200)}`);
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

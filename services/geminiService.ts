/// <reference types="vite/client" />

// In production (Vercel), /api/chat is a serverless function that hides the API key.
// In dev, we fall back to calling Gemini directly since there's no serverless runtime.
const DEV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const IS_DEV = import.meta.env.DEV;

async function callGeminiDirect(userPrompt: string): Promise<string> {
  if (!DEV_API_KEY) {
    const err = new Error('API key not configured for dev mode') as Error & { code: string };
    err.code = 'API_KEY_MISSING';
    throw err;
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${DEV_API_KEY}`;
  const payload = {
    systemInstruction: {
      parts: [{
        text: "You are the 'WebManufaktur Strategic Consultant'. We are a high-end web design and content agency in Berlin (WebManufaktur Berlin). The user will describe their business or a content need. You will provide a punchy, high-value strategic tip, a potential slogan, or a content hook. Keep the tone professional, modern, 'Berlin-cool' (minimalist and direct), and authoritative. Keep the response under 60 words."
      }]
    },
    contents: [{ parts: [{ text: userPrompt }] }],
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData?.error?.message || 'API request failed') as Error & { code: string };
    err.code = 'AI_ERROR';
    throw err;
  }

  const data = await response.json();
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }
  const err = new Error('Unexpected API response') as Error & { code: string };
  err.code = 'AI_ERROR';
  throw err;
}

async function callBackendAPI(userPrompt: string): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const code = data.code || `HTTP_${response.status}`;
    const error = new Error(data.error || 'Request failed') as Error & { code: string };
    error.code = code;
    throw error;
  }

  const data = await response.json();
  return data.text || 'Analyzing market data...';
}

export const getStrategyAdvice = async (userPrompt: string): Promise<string> => {
  try {
    // Dev: call Gemini directly (no serverless runtime)
    // Prod: call /api/chat (Vercel serverless, hides API key)
    if (IS_DEV) {
      return await callGeminiDirect(userPrompt);
    }
    return await callBackendAPI(userPrompt);
  } catch (error: any) {
    // Timeout
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      const timeoutErr = new Error('Request timed out') as Error & { code: string };
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }
    // Network error (offline, DNS failure, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      const netErr = new Error('Network error') as Error & { code: string };
      netErr.code = 'NETWORK_ERROR';
      throw netErr;
    }
    // Re-throw if it already has a code
    if (error.code) throw error;
    // Unknown
    const unknownErr = new Error(error.message || 'Unknown error') as Error & { code: string };
    unknownErr.code = 'UNKNOWN';
    throw unknownErr;
  }
};

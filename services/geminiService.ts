/// <reference types="vite/client" />

// In production (Vercel), /api/chat is a serverless function that hides the API key.
// In dev, we fall back to calling Gemini directly since there's no serverless runtime.
const DEV_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const IS_DEV = import.meta.env.DEV;

// ── Client-side rate limiting ────────────────────────────────────────
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

// ── Error code mapping from HTTP status ──────────────────────────────
function mapHttpStatusToCode(status: number): string {
  switch (status) {
    case 400: return 'BAD_REQUEST';
    case 403: return 'FORBIDDEN';
    case 404: return 'MODEL_NOT_FOUND';
    case 429: return 'QUOTA_EXCEEDED';
    default:
      if (status >= 500) return 'AI_SERVER_ERROR';
      return 'AI_ERROR';
  }
}

function createCodedError(message: string, code: string): Error & { code: string } {
  const err = new Error(message) as Error & { code: string };
  err.code = code;
  return err;
}

async function callGeminiDirect(userPrompt: string): Promise<string> {
  if (!DEV_API_KEY) {
    console.error('[CHATBOT ERR] API_KEY_MISSING — VITE_GEMINI_API_KEY is not set in .env');
    throw createCodedError('API key not configured for dev mode', 'API_KEY_MISSING');
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

  console.log('[CHATBOT] Sending request to Gemini API (dev mode)...');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const code = mapHttpStatusToCode(response.status);
    const geminiMsg = errorData?.error?.message || `HTTP ${response.status}`;
    console.error(`[CHATBOT ERR] ${code} (HTTP ${response.status}) — ${geminiMsg}`);
    throw createCodedError(geminiMsg, code);
  }

  const data = await response.json();
  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    console.log('[CHATBOT] ✓ Response received successfully');
    return data.candidates[0].content.parts[0].text;
  }

  console.error('[CHATBOT ERR] AI_ERROR — Unexpected API response structure', data);
  throw createCodedError('Unexpected API response', 'AI_ERROR');
}

async function callBackendAPI(userPrompt: string): Promise<string> {
  console.log('[CHATBOT] Sending request to /api/chat (prod mode)...');

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    // Backend already sends a code — use it, or derive from HTTP status
    const code = data.code || mapHttpStatusToCode(response.status);
    const message = data.error || `Request failed (HTTP ${response.status})`;
    console.error(`[CHATBOT ERR] ${code} (HTTP ${response.status}) — ${message}`);
    throw createCodedError(message, code);
  }

  const data = await response.json();
  console.log('[CHATBOT] ✓ Response received successfully');
  return data.text || 'Analyzing market data...';
}

export const getStrategyAdvice = async (userPrompt: string): Promise<string> => {
  // ── Client-side rate limiting ────────────────────────────────────
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (lastRequestTime > 0 && elapsed < MIN_REQUEST_INTERVAL) {
    const waitSec = Math.ceil((MIN_REQUEST_INTERVAL - elapsed) / 1000);
    console.warn(`[CHATBOT ERR] CLIENT_RATE_LIMITED — Wait ${waitSec}s before next request`);
    throw createCodedError(`Bitte warte ${waitSec} Sekunde(n)`, 'RATE_LIMITED');
  }
  lastRequestTime = now;

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
      console.error('[CHATBOT ERR] TIMEOUT — Request exceeded 15s');
      throw createCodedError('Request timed out', 'TIMEOUT');
    }
    // Network error (offline, DNS failure, etc.)
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error('[CHATBOT ERR] NETWORK_ERROR —', error.message);
      throw createCodedError('Network error', 'NETWORK_ERROR');
    }
    // Re-throw if it already has a code (from our handlers above)
    if (error.code) throw error;
    // Unknown
    console.error('[CHATBOT ERR] UNKNOWN —', error.message || error);
    throw createCodedError(error.message || 'Unknown error', 'UNKNOWN');
  }
};

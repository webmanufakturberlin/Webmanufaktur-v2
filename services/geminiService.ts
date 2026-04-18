/// <reference types="vite/client" />

// All requests flow through /api/chat (Vercel serverless function that hides the API key).
// For dev, run `vercel dev` alongside `vite` — vite.config.ts proxies /api to the Vercel dev port.

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000;

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

async function callBackendAPI(userPrompt: string): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    const code = data.code || mapHttpStatusToCode(response.status);
    const message = data.error || `Request failed (HTTP ${response.status})`;
    throw createCodedError(message, code);
  }

  const data = await response.json();
  return data.text || 'Analyzing market data...';
}

export const getStrategyAdvice = async (userPrompt: string): Promise<string> => {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (lastRequestTime > 0 && elapsed < MIN_REQUEST_INTERVAL) {
    const waitSec = Math.ceil((MIN_REQUEST_INTERVAL - elapsed) / 1000);
    throw createCodedError(`Bitte warte ${waitSec} Sekunde(n)`, 'RATE_LIMITED');
  }
  lastRequestTime = now;

  try {
    return await callBackendAPI(userPrompt);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw createCodedError('Request timed out', 'TIMEOUT');
      }
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw createCodedError('Network error', 'NETWORK_ERROR');
      }
      if ('code' in error) throw error;
      throw createCodedError(error.message, 'UNKNOWN');
    }
    throw createCodedError('Unknown error', 'UNKNOWN');
  }
};

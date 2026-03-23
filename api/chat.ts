import type { VercelRequest, VercelResponse } from '@vercel/node';

// REQUIRED: Set GEMINI_API_KEY as a Vercel Environment Variable
// In Vercel Dashboard: Settings > Environment Variables > Add "GEMINI_API_KEY"

// Simple in-memory rate limiter (per-IP, resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max requests
const RATE_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', code: 'METHOD_NOT_ALLOWED' });
  }

  // Rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({
      error: 'Zu viele Anfragen. Bitte warte einen Moment.',
      code: 'RATE_LIMITED',
    });
  }

  // Input validation
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({
      error: 'Bitte gib eine Frage ein.',
      code: 'INVALID_PROMPT',
    });
  }

  if (prompt.length > 500) {
    return res.status(400).json({
      error: 'Deine Nachricht ist zu lang (max. 500 Zeichen).',
      code: 'PROMPT_TOO_LONG',
    });
  }

  // Sanitize input
  const sanitizedPrompt = prompt.replace(/[<>]/g, '').trim();

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return res.status(500).json({
      error: 'Der KI-Service ist nicht konfiguriert.',
      code: 'API_KEY_MISSING',
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `You are the "WebManufaktur Strategic Consultant". We are a high-end web design and content agency in Berlin (WebManufaktur Berlin).

      User input: "${sanitizedPrompt}"

      Your goal: The user will describe their business or a content need. You will provide a punchy, high-value strategic tip, a potential slogan, or a content hook.
      Keep the tone professional, modern, 'Berlin-cool' (minimalist and direct), and authoritative.
      Keep the response under 60 words.`,
    });

    return res.status(200).json({ text: response.text || 'Analyzing market data...' });
  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);

    // Distinguish between connectivity and API errors
    if (error?.message?.includes('fetch') || error?.message?.includes('ECONNREFUSED') || error?.message?.includes('network')) {
      return res.status(503).json({
        error: 'Der KI-Service ist momentan nicht erreichbar.',
        code: 'AI_UNAVAILABLE',
      });
    }

    return res.status(500).json({
      error: 'Bei der Verarbeitung ist ein Fehler aufgetreten.',
      code: 'AI_ERROR',
    });
  }
}

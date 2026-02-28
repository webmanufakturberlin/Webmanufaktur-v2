export const getStrategyAdvice = async (userPrompt: string): Promise<string> => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: userPrompt }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'API request failed');
  }

  const data = await response.json();
  return data.text || 'Analyzing market data...';
};

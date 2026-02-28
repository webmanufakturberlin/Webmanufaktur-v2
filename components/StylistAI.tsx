import React, { useState } from 'react';
import { getStrategyAdvice } from '../services/geminiService';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

export const BusinessAI: React.FC = () => {
  const { t } = useI18n();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse(null);
    setError(false);

    try {
      const advice = await getStrategyAdvice(prompt);
      setResponse(advice);
    } catch {
      setError(true);
      setResponse(t('ai.errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative z-10 px-4 py-32 max-w-6xl mx-auto">
      <Reveal width="100%" variant="scale">
        <div className="relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 shadow-2xl">

          <div className="rounded-[2.4rem] bg-white p-8 md:p-16 relative overflow-hidden h-full">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              aria-hidden="true"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
              }}
            />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

              <div>
                <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-black text-white shadow-lg" aria-hidden="true">
                  <Bot size={28} />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-ink leading-tight">
                  {t('ai.headline1')} <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{t('ai.headline2')}</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  {t('ai.desc')}
                </p>

                <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
                  <div className="flex -space-x-2" aria-hidden="true">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white"></div>
                  </div>
                  <span>{t('ai.usedBy')}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-inner">
                <form onSubmit={handleAsk} className="relative group mb-4">
                  <label htmlFor="ai-strategy-input" className="sr-only">{t('ai.placeholder')}</label>
                  <input
                    id="ai-strategy-input"
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('ai.placeholder')}
                    className="w-full bg-white border border-gray-200 rounded-xl px-6 py-5 pr-14 text-lg text-ink placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="absolute right-3 top-3 p-3 rounded-lg bg-black hover:bg-gray-800 text-white disabled:opacity-50 transition-colors shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500"
                    aria-label="Submit question"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
                  </button>
                </form>

                <div aria-live="polite" aria-atomic="true">
                  {response ? (
                    <div className={`p-6 rounded-2xl bg-white border shadow-sm animate-slide-up ${error ? 'border-red-100' : 'border-blue-100'}`}>
                      <div className={`flex items-center gap-2 mb-3 font-bold text-xs uppercase tracking-wider ${error ? 'text-red-500' : 'text-blue-600'}`}>
                        <Sparkles size={14} aria-hidden="true" />
                        {error ? t('ai.error') : t('ai.insight')}
                      </div>
                      <p className="text-lg text-gray-800 leading-relaxed font-medium">
                        "{response}"
                      </p>
                    </div>
                  ) : (
                    <div className="h-32 flex items-center justify-center text-gray-400 text-sm italic">
                      {t('ai.results')}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};
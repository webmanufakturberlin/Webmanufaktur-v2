import React from 'react';
import { Reveal } from './Reveal';
import { useI18n } from '../i18n';

export const Proof: React.FC = () => {
  const { t } = useI18n();

  const stats = [
    { label: t('proof.stat1.label'), value: t('proof.stat1.value') },
    { label: t('proof.stat2.label'), value: t('proof.stat2.value') },
    { label: t('proof.stat3.label'), value: t('proof.stat3.value') },
  ];

  return (
    <section className="relative z-10 px-4 py-24 bg-white" aria-label="Company achievements">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <Reveal key={idx} width="100%" delay={idx * 0.1}>
              <div className="text-center px-4 pt-8 md:pt-0 group cursor-default">
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-gray-900 to-gray-500 mb-4 tracking-tight group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500">
                  {stat.value}
                </div>
                <div className="text-sm font-bold tracking-widest uppercase text-gray-400 group-hover:text-blue-500 transition-colors">
                  {stat.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const STEP_NUMBERS = ['01', '02', '03', '04', '05', '06'];

interface TimelineItemProps {
  item: TimelineEntry;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, index, scrollYProgress }) => {
  const [isShimmering, setIsShimmering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mobile: auto-shimmer via IntersectionObserver
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile || !cardRef.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsShimmering(true);
        setTimeout(() => setIsShimmering(false), 1500);
      }
    }, { threshold: 0.5 });
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const threshold = index * 0.25;
  const isActive = useTransform(scrollYProgress, [Math.max(0, threshold - 0.05), threshold + 0.2], [0, 1]);
  const cardX = useTransform(isActive, [0, 1], [0, 8]);
  const cardOpacity = useTransform(scrollYProgress, [Math.max(0, threshold - 0.1), threshold + 0.1], [0.35, 1]);
  const numberScale = useTransform(isActive, [0, 1], [1, 1.35]);
  const numberColor = useTransform(isActive, [0, 1], ['#9ca3af', '#3b82f6']);
  const numberGlow = useTransform(isActive, [0, 1], [
    '0px 0px 0px rgba(59,130,246,0)',
    '0px 0px 24px rgba(59,130,246,0.65)',
  ]);
  const cardBorder = useTransform(isActive, [0, 1], [
    'rgba(229,231,235,0.2)',
    'rgba(59,130,246,0.45)',
  ]);
  const cardShadow = useTransform(isActive, [0, 1], [
    '0px 0px 0px rgba(59,130,246,0)',
    '0px 0px 40px rgba(59,130,246,0.18)',
  ]);
  const dotColor = useTransform(isActive, [0, 1], ['#e5e7eb', '#3b82f6']);
  const dotScale = useTransform(isActive, [0, 1], [1, 1.45]);
  const dotShadow = useTransform(isActive, [0, 1], [
    '0px 0px 0px rgba(59,130,246,0)',
    '0px 0px 16px rgba(59,130,246,0.85)',
  ]);

  return (
    <div className="flex justify-start pt-10 md:pt-32 md:gap-10">
      {/* Left sidebar — numbered step + dot + title */}
      <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full gap-0 md:gap-3">
        {/* Step number — desktop only */}
        <motion.span
          style={{ scale: numberScale, color: numberColor, textShadow: numberGlow }}
          className="hidden md:block text-5xl font-black font-mono leading-none select-none w-16 text-right shrink-0"
        >
          {STEP_NUMBERS[index] ?? String(index + 1).padStart(2, '0')}
        </motion.span>

        {/* Dot */}
        <div className="h-10 absolute left-3 md:relative md:left-auto w-10 rounded-full bg-white dark:bg-neutral-950 shadow-xl flex items-center justify-center shrink-0">
          <motion.div
            style={{ backgroundColor: dotColor, scale: dotScale, boxShadow: dotShadow }}
            className="h-4 w-4 rounded-full border border-gray-100"
          />
        </div>

        {/* Title — desktop */}
        <h3 className="hidden md:block text-xl md:pl-2 md:text-3xl font-bold text-gray-400 leading-tight">
          {item.title}
        </h3>
      </div>

      {/* Content card */}
      <motion.div
        ref={cardRef}
        style={{
          x: cardX,
          opacity: cardOpacity,
          borderColor: cardBorder,
          boxShadow: cardShadow,
        }}
        className={`relative pl-20 pr-4 md:pl-6 md:pr-6 md:py-6 md:rounded-2xl md:border border-transparent w-full ${
          isShimmering ? 'shimmer-mask' : ''
        }`}
      >
        {/* Mobile: step number badge + title */}
        <div className="md:hidden flex items-center gap-3 mb-3">
          <span className="text-xs font-black font-mono text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
            {STEP_NUMBERS[index] ?? String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="text-xl font-bold text-gray-400">{item.title}</h3>
        </div>

        {item.content}
      </motion.div>
    </div>
  );
};

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <TimelineItem
            key={index}
            item={item}
            index={index}
            scrollYProgress={scrollYProgress}
          />
        ))}

        {/* Vertical progress line — wider (6px) with stronger glow */}
        <div
          style={{ height: height + 'px' }}
          className="absolute md:left-[5.5rem] left-8 top-0 overflow-hidden w-[6px] bg-gradient-to-b from-transparent via-gray-200 to-transparent [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] rounded-full"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[6px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full shadow-[0_0_28px_rgba(59,130,246,0.85)]"
          />
        </div>
      </div>
    </div>
  );
};

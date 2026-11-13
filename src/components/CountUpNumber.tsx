import React, { useEffect, useRef, useState } from 'react';

interface CountUpNumberProps {
  value: number;
  formatter: (val: number) => string;
  durationMs?: number;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  formatter,
  durationMs = 550,
  className = '',
}) => {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const startVal = prevRef.current;
    const diff = value - startVal;
    if (diff === 0) {
      setDisplay(value);
      return;
    }
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(startVal + diff * eased));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        prevRef.current = value;
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value, durationMs]);

  return <span className={`tabular-nums ${className}`}>{formatter(display)}</span>;
};

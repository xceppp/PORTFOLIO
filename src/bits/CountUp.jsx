import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

export default function CountUp({
  end,
  prefix = '',
  suffix = '',
  duration = 1200,
  className = '',
}) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? end : 0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setValue(end);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const from = 0;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - t) ** 3;
          setValue(Math.round(from + (end - from) * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}

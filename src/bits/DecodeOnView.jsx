import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

const GLYPHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ#%*&';

function scrambleToward(target, progress) {
  const revealed = Math.floor(progress * target.length);
  return target
    .split('')
    .map((ch, i) => {
      if (ch === ' ' || ch === '·' || ch === ',' || ch === '.' || ch === '’' || ch === "'") {
        return ch;
      }
      if (i < revealed) return target[i];
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join('');
}

export default function DecodeOnView({ text, className = '', as: Tag = 'p', delay = 0 }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(reduced ? text : '');
  const ref = useRef(null);
  const frame = useRef(0);
  const started = useRef(false);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const run = () => {
          const start = performance.now();
          const duration = 680;
          const tick = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - (1 - t) ** 2;
            setDisplay(scrambleToward(text, eased));
            if (t < 1) frame.current = requestAnimationFrame(tick);
            else setDisplay(text);
          };
          frame.current = requestAnimationFrame(tick);
        };

        window.setTimeout(run, delay);
        observer.disconnect();
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [text, delay, reduced]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display || '\u00A0'}</span>
    </Tag>
  );
}

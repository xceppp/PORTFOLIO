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

export default function DecodeCycle({ text, className = '', as: Tag = 'p' }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return undefined;
    }

    if (first.current) {
      first.current = false;
      setDisplay(text);
      return undefined;
    }

    cancelAnimationFrame(frame.current);
    const start = performance.now();
    const duration = 720;
    const messyHold = 180;

    const run = (now) => {
      const elapsed = now - start;
      if (elapsed < messyHold) {
        setDisplay(scrambleToward(text, 0));
        frame.current = requestAnimationFrame(run);
        return;
      }
      const t = Math.min(1, (elapsed - messyHold) / duration);
      const eased = 1 - (1 - t) ** 2;
      setDisplay(scrambleToward(text, eased));
      if (t < 1) {
        frame.current = requestAnimationFrame(run);
      } else {
        setDisplay(text);
      }
    };

    frame.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame.current);
  }, [text, reduced]);

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}

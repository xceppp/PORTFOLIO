import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-';

export default function DecryptedText({ text, className = '', as: Tag = 'span' }) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const timer = useRef(null);

  const scramble = () => {
    if (reduced) return;
    cancelAnimationFrame(frame.current);
    let step = 0;
    const run = () => {
      step += 1;
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ' || ch === '.' || ch === ':' || ch === '/') return ch;
            if (i < step / 2) return text[i];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join(''),
      );
      if (step < text.length * 2) {
        frame.current = requestAnimationFrame(run);
      } else {
        setDisplay(text);
      }
    };
    frame.current = requestAnimationFrame(run);
  };

  const reset = () => {
    cancelAnimationFrame(frame.current);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDisplay(text), 80);
  };

  useEffect(() => () => {
    cancelAnimationFrame(frame.current);
    clearTimeout(timer.current);
  }, []);

  return (
    <Tag
      className={className}
      onMouseEnter={scramble}
      onFocus={scramble}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {display}
    </Tag>
  );
}

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

export default function BlurText({
  text,
  className = '',
  as: Tag = 'h1',
  by = 'words',
}) {
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return undefined;
    }
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  if (by === 'line') {
    return (
      <Tag
        className={`blur-text blur-text--line ${ready ? 'is-ready' : ''} ${className}`.trim()}
        aria-label={text}
      >
        <span className="blur-text__line" aria-hidden="true">
          {text}
        </span>
      </Tag>
    );
  }

  const words = text.split(' ');

  return (
    <Tag className={`blur-text ${ready ? 'is-ready' : ''} ${className}`.trim()} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="blur-text__word"
          style={{ transitionDelay: reduced ? '0ms' : `${i * 80}ms` }}
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </Tag>
  );
}

import { useEffect, useId, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

/** Match CSS write timing: 0.45s + word-i * 2.85s + 2.6s */
const WRITE_START_MS = 450;
const WRITE_STAGGER_MS = 2850;
const WRITE_DURATION_MS = 2600;

export default function HeroName({ text }) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');
  const glowId = `name-glow-${uid}`;
  const words = text.trim().split(/\s+/);
  const chars = [...text];
  const [glowing, setGlowing] = useState(false);

  useEffect(() => {
    if (reduced) return undefined;
    const doneAt =
      WRITE_START_MS +
      (words.length - 1) * WRITE_STAGGER_MS +
      WRITE_DURATION_MS +
      280;
    const id = window.setTimeout(() => setGlowing(true), doneAt);
    return () => window.clearTimeout(id);
  }, [reduced, words.length]);

  if (reduced) {
    return (
      <h1 className="hero__name is-static" aria-label={text}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="hero__name-word">
            <span className="hero__name-word-ink">{word}</span>
          </span>
        ))}
      </h1>
    );
  }

  /* After write: letter-by-letter edge light, loops H → Z forever */
  if (glowing) {
    let letterIndex = 0;
    const letterCount = chars.filter((ch) => ch !== ' ').length;
    return (
      <h1
        className="hero__name is-glowing"
        aria-label={text}
        style={{ '--letter-count': letterCount }}
      >
        <svg
          className="hero__name-svg"
          viewBox="0 0 1600 210"
          preserveAspectRatio="xMidYMid meet"
          role="presentation"
          focusable="false"
        >
          <defs>
            <filter id={glowId} x="-25%" y="-50%" width="150%" height="200%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id={`${glowId}-line`} x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id={`${glowId}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f5e6c0" />
              <stop offset="100%" stopColor="#c29a5b" />
            </linearGradient>
          </defs>

          <text
            className="hero__name-row"
            x="50%"
            y="74%"
            textAnchor="middle"
            aria-hidden="true"
          >
            {chars.map((ch, i) => (
              <tspan key={`fill-${i}`} className="hero__name-fill">
                {ch === ' ' ? '\u00A0' : ch}
              </tspan>
            ))}
          </text>

          <text
            className="hero__name-row"
            x="50%"
            y="74%"
            textAnchor="middle"
            fill="none"
            filter={`url(#${glowId})`}
            aria-hidden="true"
          >
            {chars.map((ch, i) => {
              if (ch === ' ') {
                return <tspan key={`stroke-${i}`}>{'\u00A0'}</tspan>;
              }
              const order = letterIndex;
              letterIndex += 1;
              return (
                <tspan
                  key={`stroke-${i}`}
                  className="hero__name-stroke"
                  style={{ '--letter-index': order }}
                >
                  {ch}
                </tspan>
              );
            })}
          </text>

          {/* Light carried back H → Z before the next lap */}
          <g
            className="hero__name-return"
            filter={`url(#${glowId}-line)`}
            aria-hidden="true"
          >
            <line
              className="hero__name-return-line hero__name-return-line--glow"
              x1="1385"
              y1="108"
              x2="215"
              y2="108"
            />
            <line
              className="hero__name-return-line"
              x1="1385"
              y1="108"
              x2="215"
              y2="108"
              stroke={`url(#${glowId}-grad)`}
            />
          </g>
        </svg>
      </h1>
    );
  }

  /* Write phase: slow word-by-word reveal with soft light */
  return (
    <h1 className="hero__name is-writing" aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="hero__name-word"
          style={{ '--word-i': i }}
        >
          <span className="hero__name-word-ink" aria-hidden="true">
            {word}
          </span>
          <span className="hero__name-word-light" aria-hidden="true">
            {word}
          </span>
          <span className="visually-hidden">{word}</span>
        </span>
      ))}
    </h1>
  );
}

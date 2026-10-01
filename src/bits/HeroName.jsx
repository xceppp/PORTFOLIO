import { useEffect, useId, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

const LETTER_STEP_MS = 1150;
const RETURN_STEP_MS = 1850;

export default function HeroName({ text }) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');
  const glowId = `name-glow-${uid}`;
  const chars = [...text];
  const letterCount = chars.filter((ch) => ch !== ' ').length;
  const scrolledRef = useRef(false);
  let letterIndex = 0;

  useEffect(() => {
    if (reduced || scrolledRef.current) return undefined;
    /* After the last letter finishes its first light pass → Manifeste */
    const afterLastLetter = letterCount * LETTER_STEP_MS + 320;
    const id = window.setTimeout(() => {
      if (scrolledRef.current) return;
      scrolledRef.current = true;
      const target = document.getElementById('manifeste');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, afterLastLetter);
    return () => window.clearTimeout(id);
  }, [reduced, letterCount]);

  if (reduced) {
    return (
      <h1 className="hero__name is-static" aria-label={text}>
        <span className="hero__name-plain">{text}</span>
      </h1>
    );
  }

  return (
    <h1
      className="hero__name is-glowing"
      aria-label={text}
      style={{
        '--letter-count': letterCount,
        '--letter-step': `${LETTER_STEP_MS}ms`,
        '--return-step': `${RETURN_STEP_MS}ms`,
      }}
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
            <stop className="hero__name-grad-a" offset="0%" />
            <stop className="hero__name-grad-b" offset="45%" />
            <stop className="hero__name-grad-c" offset="100%" />
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

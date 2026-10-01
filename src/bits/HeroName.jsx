import { useId } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

export default function HeroName({ text }) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');
  const glowId = `name-glow-${uid}`;
  const chars = [...text];
  let letterIndex = 0;

  return (
    <h1 className="hero__name" aria-label={text}>
      <svg
        className="hero__name-svg"
        viewBox="0 0 1700 240"
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
        focusable="false"
      >
        <defs>
          <filter id={glowId} x="-40%" y="-60%" width="180%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="soft" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="bloom" />
            <feColorMatrix
              in="bloom"
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 1.6 0"
              result="brightBloom"
            />
            <feMerge>
              <feMergeNode in="brightBloom" />
              <feMergeNode in="soft" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
              return (
                <tspan key={`stroke-${i}`}>{'\u00A0'}</tspan>
              );
            }
            const order = letterIndex;
            letterIndex += 1;
            return (
              <tspan
                key={`stroke-${i}`}
                className={`hero__name-stroke ${reduced ? 'is-static' : ''}`}
                style={
                  reduced
                    ? undefined
                    : { '--letter-index': order }
                }
              >
                {ch}
              </tspan>
            );
          })}
        </text>
      </svg>
    </h1>
  );
}

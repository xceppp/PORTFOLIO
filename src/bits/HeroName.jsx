import { useEffect, useId, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

const LETTER_STEP_MS = 1150;

function useIsMobile(maxWidth = 759) {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= maxWidth : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [maxWidth]);

  return mobile;
}

function NameSvg({ text, words, stacked, glowId }) {
  let letterIndex = 0;
  const viewBox = stacked ? '0 0 1100 420' : '0 0 1600 210';
  const fontSize = stacked ? 168 : 178;

  const strokeLetter = (ch, key) => {
    if (ch === ' ') {
      return <tspan key={key}>{'\u00A0'}</tspan>;
    }
    const order = letterIndex;
    letterIndex += 1;
    return (
      <tspan
        key={key}
        className="hero__name-stroke"
        style={{ '--letter-index': order }}
      >
        {ch}
      </tspan>
    );
  };

  const fillLetter = (ch, key) => (
    <tspan key={key} className="hero__name-fill">
      {ch === ' ' ? '\u00A0' : ch}
    </tspan>
  );

  return (
    <svg
      className={`hero__name-svg ${stacked ? 'is-stacked' : ''}`}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      focusable="false"
    >
      <defs>
        <filter id={glowId} x="-40%" y="-80%" width="180%" height="260%">
          <feGaussianBlur stdDeviation="4.5" result="blur" />
          <feGaussianBlur stdDeviation="1.2" in="SourceGraphic" result="tight" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="tight" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {stacked ? (
        <>
          {words.map((word, wi) => (
            <text
              key={`fill-${wi}`}
              className="hero__name-row"
              x="50%"
              y={wi === 0 ? '38%' : '86%'}
              textAnchor="middle"
              style={{ fontSize: `${fontSize}px` }}
              aria-hidden="true"
            >
              {[...word].map((ch, i) => fillLetter(ch, `f-${wi}-${i}`))}
            </text>
          ))}
          {words.map((word, wi) => (
            <text
              key={`stroke-${wi}`}
              className="hero__name-row"
              x="50%"
              y={wi === 0 ? '38%' : '86%'}
              textAnchor="middle"
              fill="none"
              filter={`url(#${glowId})`}
              style={{ fontSize: `${fontSize}px` }}
              aria-hidden="true"
            >
              {[...word].map((ch, i) => strokeLetter(ch, `s-${wi}-${i}`))}
            </text>
          ))}
        </>
      ) : (
        <>
          <text
            className="hero__name-row"
            x="50%"
            y="74%"
            textAnchor="middle"
            style={{ fontSize: `${fontSize}px` }}
            aria-hidden="true"
          >
            {[...text].map((ch, i) => fillLetter(ch, `f-${i}`))}
          </text>
          <text
            className="hero__name-row"
            x="50%"
            y="74%"
            textAnchor="middle"
            fill="none"
            filter={`url(#${glowId})`}
            style={{ fontSize: `${fontSize}px` }}
            aria-hidden="true"
          >
            {[...text].map((ch, i) => strokeLetter(ch, `s-${i}`))}
          </text>
        </>
      )}
    </svg>
  );
}

export default function HeroName({ text }) {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const uid = useId().replace(/:/g, '');
  const glowId = `name-glow-${uid}`;
  const words = text.trim().split(/\s+/);
  const letterCount = words.reduce((n, w) => n + w.length, 0);
  const rootRef = useRef(null);
  const [active, setActive] = useState(true);
  const stacked = mobile && words.length > 1;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      <h1
        ref={rootRef}
        className={`hero__name is-static ${stacked ? 'is-stacked' : ''}`}
        aria-label={text}
      >
        {stacked ? (
          words.map((word) => (
            <span key={word} className="hero__name-plain">
              {word}
            </span>
          ))
        ) : (
          <span className="hero__name-plain">{text}</span>
        )}
      </h1>
    );
  }

  return (
    <h1
      ref={rootRef}
      className={`hero__name is-glowing ${stacked ? 'is-stacked' : ''} ${
        active ? '' : 'is-paused'
      }`}
      aria-label={text}
      style={{
        '--letter-count': letterCount,
        '--letter-step': `${LETTER_STEP_MS}ms`,
      }}
    >
      <NameSvg text={text} words={words} stacked={stacked} glowId={glowId} />
    </h1>
  );
}

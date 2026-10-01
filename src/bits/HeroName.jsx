import { useEffect, useId, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';

const LETTER_STEP_MS = 1150;
const RETURN_STEP_MS = 1850;
const HERO_HOLD_MS = 3500;
const SCROLL_DOWN_MS = 1600;
const NAV_OFFSET = 60;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function smoothScrollTo(y, duration = SCROLL_DOWN_MS) {
  const startY = window.scrollY || window.pageYOffset;
  const delta = y - startY;
  if (Math.abs(delta) < 2) return () => {};

  const prevBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';

  let raf = 0;
  const start = performance.now();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = easeInOutCubic(t);
    window.scrollTo(0, startY + delta * eased);
    if (t < 1) {
      raf = requestAnimationFrame(tick);
    } else {
      document.documentElement.style.scrollBehavior = prevBehavior;
    }
  };

  raf = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(raf);
    document.documentElement.style.scrollBehavior = prevBehavior;
  };
}

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
  const returnLine = stacked
    ? { x1: 920, y1: 340, x2: 180, y2: 95 }
    : { x1: 1385, y1: 108, x2: 215, y2: 108 };

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
        <filter id={`${glowId}-line`} x="-30%" y="-250%" width="160%" height="600%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
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

      <g
        className="hero__name-return"
        filter={`url(#${glowId}-line)`}
        aria-hidden="true"
      >
        <line
          className="hero__name-return-line hero__name-return-line--glow"
          {...returnLine}
        />
        <line
          className="hero__name-return-line"
          {...returnLine}
          stroke={`url(#${glowId}-grad)`}
        />
      </g>
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
  const scrolledRef = useRef(false);
  const rootRef = useRef(null);
  const [active, setActive] = useState(true);
  const stacked = mobile && words.length > 1;

  useEffect(() => {
    if (reduced || scrolledRef.current) return undefined;
    let cancelScroll = () => {};

    const id = window.setTimeout(() => {
      if (scrolledRef.current) return;
      scrolledRef.current = true;
      const target = document.getElementById('manifeste');
      if (!target) return;
      const top =
        target.getBoundingClientRect().top +
        (window.scrollY || window.pageYOffset) -
        NAV_OFFSET;
      cancelScroll = smoothScrollTo(Math.max(0, top), SCROLL_DOWN_MS);
    }, HERO_HOLD_MS);

    return () => {
      window.clearTimeout(id);
      cancelScroll();
    };
  }, [reduced]);

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
        '--return-step': `${RETURN_STEP_MS}ms`,
      }}
    >
      <NameSvg text={text} words={words} stacked={stacked} glowId={glowId} />
    </h1>
  );
}

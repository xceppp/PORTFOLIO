import { useEffect, useRef, useState } from 'react';
import CountUp from '../bits/CountUp';
import DecodeOnView from '../bits/DecodeOnView';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { instruments } from '../content';

export default function Instruments() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const [live, setLive] = useState(reduced);

  useEffect(() => {
    if (reduced) {
      setLive(true);
      return undefined;
    }
    const el = sectionRef.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className={`section instruments ${live ? 'is-live' : ''}`}
      aria-label={instruments.title}
    >
      <div className="shell">
        <h2 className="section-title instruments__title">{instruments.title}</h2>

        <ul className="stats">
          {instruments.items.map((item, i) => (
            <li
              key={item.label}
              className="stats__item"
              style={{ '--stat-i': i }}
            >
              <span className="stats__scan" aria-hidden="true" />
              <p className="stats__value mono nums">
                <CountUp
                  end={item.numeric}
                  prefix={item.prefix}
                  suffix={item.suffix}
                  duration={1100 + i * 120}
                />
              </p>
              <div className="stats__copy">
                <DecodeOnView
                  text={item.label}
                  className="stats__label"
                  as="p"
                  delay={180 + i * 90}
                />
                <p className="stats__detail">{item.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

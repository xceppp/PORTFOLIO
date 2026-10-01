import { useEffect, useRef, useState } from 'react';
import CountUp from '../bits/CountUp';
import DecodeOnView from '../bits/DecodeOnView';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { transmission } from '../content';

export default function Transmission() {
  const { pfe, theses, teaching, interventions } = transmission;
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef(null);
  const [live, setLive] = useState(reduced);
  const [activeTeach, setActiveTeach] = useState(0);
  const maxCount = Math.max(...pfe.segments.map((s) => s.count));
  const thesesSorted = [...theses.rows].sort((a, b) => Number(b.year) - Number(a.year));
  const active = teaching[activeTeach];

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
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id={transmission.id}
      className={`section transmission ${live ? 'is-live' : ''}`}
    >
      <div className="shell">
        <h2 className="section-title">{transmission.title}</h2>

        <div className="tx-teach">
          <div className="tx-teach__list" role="tablist" aria-label="Axes d'enseignement">
            {teaching.map((group, i) => (
              <button
                key={group.title}
                type="button"
                role="tab"
                aria-selected={activeTeach === i}
                className={`tx-teach__tab ${activeTeach === i ? 'is-on' : ''}`}
                onClick={() => setActiveTeach(i)}
              >
                <span className="mono">0{i + 1}</span>
                <span>{group.title}</span>
              </button>
            ))}
          </div>
          <article className="tx-teach__panel" key={active.title}>
            <h3>{active.title}</h3>
            <p>{active.body}</p>
          </article>
        </div>

        <p className="transmission__interventions">{interventions}</p>

        <div className="pfe-schema" aria-label="Projets de fin d'études encadrés">
          <header className="pfe-schema__head">
            <div>
              <p className="pfe-schema__kicker mono">ENCADREMENT · 2011–2022</p>
              <DecodeOnView
                text="projets de fin d'études encadrés"
                className="pfe-schema__label"
                as="h3"
                delay={80}
              />
            </div>
            <p className="pfe-schema__total mono nums">
              <CountUp end={pfe.total} duration={1400} />
            </p>
          </header>

          <ol className="pfe-rank">
            {[...pfe.segments]
              .sort((a, b) => b.count - a.count)
              .map((seg, i) => (
                <li
                  key={seg.label}
                  className={`pfe-rank__row ${i === 0 ? 'is-major' : ''}`}
                  style={{ '--rank-i': i, '--fill': seg.count / maxCount }}
                >
                  <span className="pfe-rank__idx mono">0{i + 1}</span>
                  <span className="pfe-rank__count mono nums">
                    <CountUp end={seg.count} duration={1100 + i * 120} />
                  </span>
                  <div className="pfe-rank__body">
                    <div className="pfe-rank__meta">
                      <span className="pfe-rank__name">{seg.label}</span>
                      <span className="pfe-rank__share mono">
                        {Math.round((seg.count / pfe.total) * 100)}%
                      </span>
                    </div>
                    <div className="pfe-rank__track" aria-hidden="true">
                      <div className="pfe-rank__fill" />
                    </div>
                  </div>
                </li>
              ))}
          </ol>
        </div>

        <div className="theses-list">
          <div className="theses-list__head">
            <h3>{theses.title}</h3>
            <p className="mono theses-list__range">2018 → 2024 · plus récent en tête</p>
          </div>

          <ul className="theses-list__items">
            {thesesSorted.map((row) => (
              <li key={row.year + row.doctor}>
                <span className="mono nums theses-list__year">{row.year}</span>
                <div>
                  <h4>{row.doctor}</h4>
                  <p>{row.subject}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="theses__note">{theses.otherTopics}</p>
          <p className="theses__note">{theses.jurys}</p>
        </div>
      </div>
    </section>
  );
}

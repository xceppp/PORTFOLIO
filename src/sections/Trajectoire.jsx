import { useEffect, useMemo, useRef, useState } from 'react';
import AnimatedContent from '../bits/AnimatedContent';
import NavArrow from '../bits/NavArrow';
import { trajectoire } from '../content';

export default function Trajectoire() {
  const stops = useMemo(() => [...trajectoire.stations], []);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowStart, setWindowStart] = useState(0);
  const [visibleCount, setVisibleCount] = useState(5);
  const dialogRef = useRef(null);
  const current = stops[active];

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const mobile = w <= 759;
      setIsMobile(mobile);
      if (mobile) setVisibleCount(2);
      else if (w <= 900) setVisibleCount(3);
      else setVisibleCount(5);
      if (!mobile) setMapOpen(false);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const shown = Math.min(visibleCount, stops.length);
  const maxStart = Math.max(0, stops.length - shown);

  useEffect(() => {
    setWindowStart((start) => Math.min(start, maxStart));
  }, [maxStart]);

  const ensureVisible = (index) => {
    setWindowStart((start) => {
      if (index < start) return index;
      if (index >= start + shown) return Math.min(maxStart, index - shown + 1);
      return start;
    });
  };

  const select = (index, showPanel = true) => {
    const next = Math.max(0, Math.min(stops.length - 1, index));
    setActive(next);
    ensureVisible(next);
    if (showPanel) setOpen(true);
  };

  const page = (dir) => {
    const nextStart = Math.max(0, Math.min(maxStart, windowStart + dir * shown));
    if (nextStart === windowStart) return;
    setWindowStart(nextStart);
    setActive(nextStart);
  };

  useEffect(() => {
    if (!open && !mapOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setMapOpen(false);
      }
      if (open) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          select(active + 1, true);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          select(active - 1, true);
        }
      }
    };
    document.body.style.overflow = open || mapOpen ? 'hidden' : '';
    window.addEventListener('keydown', onKey);
    if (open) dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, mapOpen, active]);

  const slice = stops.slice(windowStart, windowStart + shown);
  const canPrev = windowStart > 0;
  const canNext = windowStart < maxStart;

  const openStopFromMap = (index) => {
    setActive(index);
    setMapOpen(false);
    setOpen(true);
  };

  return (
    <section id={trajectoire.id} className="section trajectoire trajectoire--line">
      <div className="shell">
        <AnimatedContent>
          <h2 className="section-title">{trajectoire.title}</h2>
        </AnimatedContent>

        {isMobile ? (
          <button
            type="button"
            className="line-map-launch"
            onClick={() => setMapOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={mapOpen}
          >
            <span className="line-map-launch__rail" aria-hidden="true" />
            <span className="line-map-launch__pins" aria-hidden="true">
              {stops.slice(0, 5).map((stop) => (
                <span key={stop.years + stop.role} className="line-map-launch__pin" />
              ))}
            </span>
            <span className="line-map-launch__copy">
              <span className="line-map-launch__label">Carte du parcours</span>
              <span className="line-map-launch__meta mono">
                {stops.length} étapes · {stops[0]?.years} → {stops[stops.length - 1]?.years}
              </span>
            </span>
            <span className="line-map-launch__cta">Ouvrir</span>
          </button>
        ) : (
          <div className="line-map" aria-label="Ligne du parcours">
            <NavArrow
              direction="prev"
              className="line-map__arrow"
              label="Segment précédent"
              disabled={!canPrev}
              onClick={() => page(-1)}
            />

            <div className="line-map__stage">
              <div className="line-map__rail" aria-hidden="true" />
              <ol className="line-map__stops">
                {slice.map((stop, localIndex) => {
                  const i = windowStart + localIndex;
                  const selected = open && i === active;
                  return (
                    <li key={stop.years + stop.role} className="line-map__stop">
                      <button
                        type="button"
                        className={`line-map__btn ${selected ? 'is-active' : ''} ${
                          stop.current ? 'is-current' : ''
                        }`}
                        aria-haspopup="dialog"
                        aria-expanded={selected}
                        onClick={() => select(i, true)}
                      >
                        <span className="line-map__title">{stop.role}</span>
                        <span className="line-map__pin" aria-hidden="true" />
                        <span className="line-map__date mono">{stop.years}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <NavArrow
              direction="next"
              className="line-map__arrow"
              label="Segment suivant"
              disabled={!canNext}
              onClick={() => page(1)}
            />
          </div>
        )}
      </div>

      {mapOpen && (
        <div
          className="line-map__overlay line-map__overlay--sheet"
          role="presentation"
          onClick={() => setMapOpen(false)}
        >
          <div
            className="line-map-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="line-map-sheet-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="line-map-sheet__head">
              <div>
                <p className="line-map-sheet__kicker mono">Carte</p>
                <h3 id="line-map-sheet-title" className="line-map-sheet__title">
                  {trajectoire.title}
                </h3>
              </div>
              <button
                type="button"
                className="line-map__close"
                aria-label="Fermer"
                onClick={() => setMapOpen(false)}
              >
                ×
              </button>
            </header>

            <ol className="line-map-full" aria-label="Trajectoire complète">
              {stops.map((stop, i) => (
                <li key={stop.years + stop.role} className="line-map-full__item">
                  <button
                    type="button"
                    className={`line-map-full__btn ${stop.current ? 'is-current' : ''}`}
                    onClick={() => openStopFromMap(i)}
                  >
                    <span className="line-map-full__pin" aria-hidden="true" />
                    <span className="line-map-full__body">
                      <span className="line-map-full__date mono">{stop.years}</span>
                      <span className="line-map-full__role">{stop.role}</span>
                      <span className="line-map-full__place">
                        {stop.place}
                        <span aria-hidden="true"> · </span>
                        {stop.institution}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {open && (
        <div
          className="line-map__overlay"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            ref={dialogRef}
            className="line-map__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="line-map-modal-title"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="line-map__close"
              aria-label="Fermer"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <p className="line-map__details-date mono">{current.years}</p>
            <h3 id="line-map-modal-title" className="line-map__details-role">
              {current.role}
            </h3>
            <p className="line-map__details-place">
              {current.place}
              <span aria-hidden="true"> · </span>
              {current.institution}
            </p>
            <p className="line-map__details-body">{current.detail}</p>
            <div className="line-map__modal-nav">
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                disabled={active === 0}
                onClick={() => select(active - 1, true)}
              >
                Précédent
              </button>
              {isMobile && (
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  onClick={() => {
                    setOpen(false);
                    setMapOpen(true);
                  }}
                >
                  Carte
                </button>
              )}
              <button
                type="button"
                className="btn btn--secondary btn--sm"
                disabled={active === stops.length - 1}
                onClick={() => select(active + 1, true)}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

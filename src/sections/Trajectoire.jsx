import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AnimatedContent from '../bits/AnimatedContent';
import NavArrow from '../bits/NavArrow';
import { useTheme } from '../hooks/useTheme';
import { trajectoire } from '../content';

const KoiStudies = lazy(() =>
  import('../threeui/KoiStudies').then((m) => ({ default: m.KoiStudies })),
);

export default function Trajectoire() {
  const stops = useMemo(() => [...trajectoire.stations], []);
  const { resolved } = useTheme();
  const theme = resolved === 'light' ? 'light' : 'dark';
  const stageRef = useRef(null);
  const panelRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(stops.length);
  const [detailOpen, setDetailOpen] = useState(false);
  const [logoBroken, setLogoBroken] = useState(false);
  const current = stops[index] || stops[0];

  useEffect(() => {
    setLogoBroken(false);
  }, [current?.logo]);

  const onIndexChange = useCallback((nextIndex, nextTotal) => {
    setIndex(nextIndex);
    if (nextTotal) setTotal(nextTotal);
  }, []);

  const onOpenDetail = useCallback((nextIndex) => {
    if (typeof nextIndex === 'number' && nextIndex >= 0) {
      setIndex(nextIndex);
    }
    setDetailOpen(true);
  }, []);

  const closeDetail = useCallback(() => setDetailOpen(false), []);

  const go = (direction) => {
    const host = stageRef.current?.querySelector('.koi-studies');
    host?.__koiNavigate?.(direction);
  };

  useEffect(() => {
    if (!detailOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDetail();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [detailOpen, closeDetail]);

  return (
    <section id={trajectoire.id} className="section trajectoire trajectoire--koi">
      <div className="shell">
        <AnimatedContent>
          <h2 className="section-title">{trajectoire.title}</h2>
          <p className="section-subtitle trajectoire__subtitle">{trajectoire.subtitle}</p>
        </AnimatedContent>

        <div className="trajectoire-koi" ref={stageRef}>
          <NavArrow
            direction="prev"
            className="trajectoire-koi__arrow"
            label="Étape précédente"
            onClick={() => go('prev')}
          />

          <div className="trajectoire-koi__stage shader-frame">
            <Suspense fallback={<div className="trajectoire-koi__fallback" aria-hidden="true" />}>
              <KoiStudies
                stations={stops}
                theme={theme}
                onIndexChange={onIndexChange}
                onOpenDetail={onOpenDetail}
              />
            </Suspense>
          </div>

          <NavArrow
            direction="next"
            className="trajectoire-koi__arrow"
            label="Étape suivante"
            onClick={() => go('next')}
          />
        </div>

        <button
          type="button"
          className="trajectoire-koi__meta trajectoire-koi__meta--btn"
          onClick={() => setDetailOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={detailOpen}
        >
          <p className="trajectoire-koi__count mono">
            {index + 1} / {total}
          </p>
          <h3 className="trajectoire-koi__role">{current.role}</h3>
          <p className="trajectoire-koi__place">
            {current.place}
            <span aria-hidden="true"> · </span>
            {current.institution}
          </p>
          <p className="trajectoire-koi__years mono">{current.years}</p>
          <p className="trajectoire-koi__detail">{current.detail}</p>
          <span className="trajectoire-koi__meta-cta">Voir les détails</span>
        </button>
      </div>

      {detailOpen ? (
        <div
          className="trajectoire-detail"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trajectoire-detail-title"
          onClick={closeDetail}
        >
          <div
            className="trajectoire-detail__panel"
            ref={panelRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="trajectoire-detail__close"
              onClick={closeDetail}
              aria-label="Fermer"
            >
              ×
            </button>
            <div className="trajectoire-detail__logo-wrap">
              {logoBroken ? (
                <span className="trajectoire-detail__mark">
                  {current.place || current.institution}
                </span>
              ) : (
                <img
                  key={current.logo}
                  className="trajectoire-detail__logo"
                  src={current.logo}
                  alt={current.institution}
                  width={240}
                  height={64}
                  loading="eager"
                  decoding="async"
                  onError={() => setLogoBroken(true)}
                />
              )}
            </div>
            <p className="trajectoire-detail__count mono">
              {index + 1} / {total}
            </p>
            <h3 id="trajectoire-detail-title" className="trajectoire-detail__role">
              {current.role}
            </h3>
            <p className="trajectoire-detail__place">
              {current.place}
              <span aria-hidden="true"> · </span>
              {current.institution}
            </p>
            <p className="trajectoire-detail__years mono">{current.years}</p>
            <p className="trajectoire-detail__body">{current.detail}</p>
            <div className="trajectoire-detail__nav">
              <button
                type="button"
                className="trajectoire-detail__nav-btn"
                onClick={() => go('prev')}
              >
                Précédent
              </button>
              <button
                type="button"
                className="trajectoire-detail__nav-btn trajectoire-detail__nav-btn--primary"
                onClick={() => go('next')}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

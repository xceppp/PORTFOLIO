import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import DecryptedText from '../bits/DecryptedText';
import MetalCta from '../bits/MetalCta';
import NavArrow from '../bits/NavArrow';
import { useInView } from '../hooks/useInView';
import { usePrefersReducedMotion, useTheme } from '../hooks/useTheme';
import { a11y, contacts, production } from '../content';

const ThreeDPaper = lazy(() =>
  import('../threeui/ThreeDPaper').then((m) => ({ default: m.ThreeDPaper })),
);

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

export default function Production() {
  const { publications, shipped } = production;
  const reduced = usePrefersReducedMotion();
  const { resolved } = useTheme();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);
  const timer = useRef(0);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { rootMargin: '120px 0px' });

  const article = publications[index];

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + publications.length) % publications.length);
    },
    [publications.length],
  );

  // Autoplay only while the section is on screen and the user isn't hovering
  useEffect(() => {
    if (reduced || paused || !inView) return undefined;
    timer.current = window.setInterval(() => go(1), 9000);
    return () => window.clearInterval(timer.current);
  }, [go, reduced, index, paused, inView]);

  useEffect(() => {
    const onMessage = (event) => {
      if (event.data?.type !== 'chalh-paper-open') return;
      const doi = event.data.doi;
      if (typeof doi === 'string' && doi.startsWith('http')) {
        window.open(doi, '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) < 40) return;
    go(dx < 0 ? 1 : -1);
  };

  const openDoi = () => {
    if (article?.doi) window.open(article.doi, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id={production.id} className="section production" ref={sectionRef}>
      <div className="shell blueprint-section">
        <div className="production__header">
          <h2 className="section-title">{production.title}</h2>
          <a
            className="production__orcid-badge"
            href={contacts.orcid}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="mono">ORCID</span>
            <DecryptedText text={contacts.orcidId} className="mono" as="span" />
            <span className="production__orcid-cta">{production.orcidLinkLabel}</span>
            <ExternalHint />
          </a>
        </div>

        <div
          className="production__paper"
          aria-label="Publications"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
          }}
        >
          <div className="production__paper-meta">
            <p className="mono">
              {String(index + 1).padStart(2, '0')} /{' '}
              {String(publications.length).padStart(2, '0')}
            </p>
            <p className="production__paper-journal">{article.journal}</p>
          </div>

          <div className="production__paper-row">
            <NavArrow
              direction="prev"
              className="production__paper-arrow"
              label="Publication précédente"
              onClick={() => go(-1)}
            />

            <div className="production__paper-stage shader-frame">
              {reduced ? (
                <button type="button" className="production__paper-fallback" onClick={openDoi}>
                  <span className="mono nums">{article.year}</span>
                  <strong>{article.title}</strong>
                  <span>{article.journal}</span>
                  <span className="doi-link">Ouvrir le DOI</span>
                </button>
              ) : (
                <Suspense fallback={<div className="production__paper-loading" aria-hidden="true" />}>
                  <ThreeDPaper
                    variant="original"
                    article={article}
                    theme={resolved === 'light' ? 'light' : 'dark'}
                    active={inView}
                  />
                </Suspense>
              )}
            </div>

            <NavArrow
              direction="next"
              className="production__paper-arrow"
              label="Publication suivante"
              onClick={() => go(1)}
            />
          </div>

          <div className="production__paper-actions">
            <MetalCta label="Ouvrir le DOI" onClick={openDoi} ariaLabel="Ouvrir le DOI" />
            <p className="production__paper-title">{article.title}</p>
          </div>

          <div
            className="production__paper-dots"
            role="tablist"
            aria-label="Choisir une publication"
          >
            {publications.map((item, i) => (
              <button
                key={item.doi}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Publication ${i + 1}: ${item.title}`}
                className={`production__paper-dot ${i === index ? 'is-on' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>

        <p className="production__latest-note">
          Dernier dépôt signalé · <span className="mono nums">{shipped.latest.year}</span> ·{' '}
          {shipped.terminal.result.replace('✓ ', '')}
        </p>
      </div>
    </section>
  );
}

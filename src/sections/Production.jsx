import { useCallback, useEffect, useRef, useState } from 'react';
import DecryptedText from '../bits/DecryptedText';
import NavArrow from '../bits/NavArrow';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { a11y, contacts, production } from '../content';

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

export default function Production() {
  const { publications, shipped } = production;
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const touchX = useRef(null);
  const timer = useRef(0);

  const go = useCallback(
    (dir) => {
      setIndex((i) => (i + dir + publications.length) % publications.length);
    },
    [publications.length],
  );

  useEffect(() => {
    if (reduced) return undefined;
    timer.current = window.setInterval(() => go(1), 5200);
    return () => window.clearInterval(timer.current);
  }, [go, reduced]);

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

  return (
    <section id={production.id} className="section production">
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

        <div className="paper-deck" aria-label="Publications">
          <div className="paper-deck__meta">
            <p className="mono">
              {String(index + 1).padStart(2, '0')} / {String(publications.length).padStart(2, '0')}
            </p>
          </div>

          <div className="paper-deck__row">
            <NavArrow
              direction="prev"
              className="paper-deck__arrow"
              label="Publication précédente"
              onClick={() => go(-1)}
            />

            <div
              className="paper-deck__stage"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {publications.map((item, i) => {
                const offset = i - index;
                const wrapped =
                  ((offset + publications.length + Math.floor(publications.length / 2)) %
                    publications.length) -
                  Math.floor(publications.length / 2);
                const active = i === index;
                const dist = Math.abs(wrapped);
                return (
                  <article
                    key={item.doi}
                    className={`paper ${active ? 'is-active' : ''}`}
                    style={{
                      '--o': wrapped,
                      '--oy': dist * 10,
                      '--sc': 1 - dist * 0.06,
                      '--op': Math.max(0.2, 1 - dist * 0.45),
                      zIndex: active ? 5 : Math.max(0, 3 - dist),
                    }}
                    aria-hidden={!active}
                  >
                    <header className="paper__top">
                      <span className="paper__mark" aria-hidden="true" />
                      <span className="mono nums paper__year">{item.year}</span>
                      <span className="paper__journal">{item.journal}</span>
                    </header>
                    <h3 className="paper__title">{item.title}</h3>
                    {item.authors && <p className="paper__authors">{item.authors}</p>}
                    <a
                      href={item.doi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doi-link"
                      tabIndex={active ? 0 : -1}
                    >
                      <DecryptedText
                        text={item.doi.replace('https://doi.org/', 'doi:')}
                        as="span"
                      />
                      <ExternalHint />
                    </a>
                  </article>
                );
              })}
            </div>

            <NavArrow
              direction="next"
              className="paper-deck__arrow"
              label="Publication suivante"
              onClick={() => go(1)}
            />
          </div>

          <div className="paper-deck__dots" role="tablist" aria-label="Choisir une publication">
            {publications.map((item, i) => (
              <button
                key={item.doi}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Publication ${i + 1}`}
                className={`paper-deck__dot ${i === index ? 'is-on' : ''}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>

          <ul className="paper-deck__list">
            {publications.map((item, i) => (
              <li key={`list-${item.doi}`}>
                <button
                  type="button"
                  className={i === index ? 'is-on' : ''}
                  onClick={() => setIndex(i)}
                >
                  <span className="mono nums">{item.year}</span>
                  <span>{item.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="production__latest-note">
          Dernier dépôt signalé · <span className="mono nums">{shipped.latest.year}</span> ·{' '}
          {shipped.terminal.result.replace('✓ ', '')}
        </p>
      </div>
    </section>
  );
}

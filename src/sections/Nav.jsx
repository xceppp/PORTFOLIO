import { useEffect, useRef, useState } from 'react';
import { a11y, contacts, identity, nav } from '../content';

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

function ThemeToggle({ preference, setPreference, resolved }) {
  const active = preference === 'system' ? resolved : preference;
  const isDark = active === 'dark';

  return (
    <button
      type="button"
      className={`theme-orb ${isDark ? 'is-dark' : 'is-light'}`}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      onClick={() => setPreference(isDark ? 'light' : 'dark')}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.2 2.1a9.9 9.9 0 0 0 0 19.8 9.9 9.9 0 0 0 8.7-5.2 8.2 8.2 0 1 1-8.7-14.6Z"
          />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5" />
          </g>
        </svg>
      )}
    </button>
  );
}

export default function Nav({ preference, setPreference, resolved }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [copied, setCopied] = useState('');
  const [showWordmark, setShowWordmark] = useState(false);
  const ctxRef = useRef(null);

  useEffect(() => {
    const hero = document.getElementById('accueil');
    if (!hero) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        setShowWordmark(!entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '-60px 0px 0px 0px' },
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setCtx(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!ctx) return undefined;
    const onPointer = (e) => {
      if (ctxRef.current && !ctxRef.current.contains(e.target)) setCtx(null);
    };
    window.addEventListener('pointerdown', onPointer);
    return () => window.removeEventListener('pointerdown', onPointer);
  }, [ctx]);

  const copy = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(''), 1600);
    } catch {
      /* ignore */
    }
  };

  const onWordmarkContext = (e) => {
    e.preventDefault();
    setCtx({ x: e.clientX, y: e.clientY });
  };

  return (
    <>
      <header className="site-nav">
        <div className="site-nav__inner">
          <a
            href="#accueil"
            className={`wordmark ${showWordmark ? 'is-visible' : 'is-deferred'}`}
            onContextMenu={onWordmarkContext}
            aria-label={`${identity.wordmark} — Accueil`}
            tabIndex={showWordmark ? 0 : -1}
            aria-hidden={!showWordmark}
          >
            {identity.wordmark}
          </a>

          <nav className="site-nav__links" aria-label="Sections">
            <ul>
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-nav__right">
            <ThemeToggle
              preference={preference}
              setPreference={setPreference}
              resolved={resolved}
            />
            <a
              className="btn btn--secondary btn--sm site-nav__orcid"
              href={contacts.orcid}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nav.orcid}
              <ExternalHint />
            </a>
            <button
              type="button"
              className="nav-burger"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`} hidden={!mobileOpen}>
        <div className="mobile-menu__top">
          <p className="mobile-menu__brand">{identity.wordmark}</p>
          <button
            type="button"
            className="mobile-menu__close"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
        </div>
        <div className="mobile-menu__inner">
          <ul className="mobile-menu__links">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setMobileOpen(false)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__actions">
            <ThemeToggle
              preference={preference}
              setPreference={setPreference}
              resolved={resolved}
            />
            <a
              className="btn btn--secondary"
              href={contacts.orcid}
              target="_blank"
              rel="noopener noreferrer"
            >
              {nav.orcid}
              <ExternalHint />
            </a>
          </div>
        </div>
      </div>

      {ctx && (
        <div
          ref={ctxRef}
          className="ctx-menu"
          style={{ left: ctx.x, top: ctx.y }}
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              copy(contacts.email, 'email');
              setCtx(null);
            }}
          >
            {copied === 'email' ? nav.contextMenu.copied : nav.contextMenu.copyEmail}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              copy(contacts.orcidId, 'orcid');
              setCtx(null);
            }}
          >
            {copied === 'orcid' ? nav.contextMenu.copied : nav.contextMenu.copyOrcid}
          </button>
          <a
            role="menuitem"
            href={contacts.orcid}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setCtx(null)}
          >
            {nav.contextMenu.openOrcid}
            <ExternalHint />
          </a>
        </div>
      )}
    </>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatedTopDock } from '../threeui/animated-top-dock/AnimatedTopDock';
import { a11y, contacts, identity, nav } from '../content';
import '../threeui/threeui.css';

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

function ThemeOrb({ isDark, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={`theme-orb ${isDark ? 'is-dark' : 'is-light'}${className ? ` ${className}` : ''}`}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      title={isDark ? 'Mode clair' : 'Mode sombre'}
      onClick={onToggle}
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

const NAV_ICONS = {
  accueil: (
    <>
      <path d="M2.4 7.2 8 2.6l5.6 4.6V13a1.2 1.2 0 0 1-1.2 1.2H3.6A1.2 1.2 0 0 1 2.4 13z" />
      <path d="M6.2 14.2V9.4h3.6v4.8" />
    </>
  ),
  manifeste: (
    <>
      <path d="M3.4 2.4h5.4l3.8 3.8v7.4H3.4z" />
      <path d="M8.8 2.4v3.8h3.8M5.9 9h4.2M5.9 11.2h3" />
    </>
  ),
  trajectoire: (
    <>
      <circle cx="3.2" cy="12.2" r="1.4" />
      <circle cx="8" cy="8" r="1.4" />
      <circle cx="12.8" cy="3.8" r="1.4" />
      <path d="m4.4 11.2 2.6-2.4M9.2 6.9l2.5-2.2" />
    </>
  ),
  systeme: (
    <>
      <path d="M8 1.9 14.1 5v6L8 14.1 1.9 11V5z" />
      <path d="M1.9 5 8 8.1 14.1 5M8 8.1v6" />
    </>
  ),
  transmission: (
    <>
      <path d="M2.2 8h11.6M8 2.4v11.2" />
      <path d="m5.2 5.2 2.8-2.8 2.8 2.8M5.2 10.8l2.8 2.8 2.8-2.8" />
    </>
  ),
  production: (
    <>
      <rect x="2.2" y="3.2" width="11.6" height="9.6" rx="1.4" />
      <path d="M2.2 6.4h11.6M5.4 3.2v3.2M8 3.2v3.2M10.6 3.2v3.2" />
    </>
  ),
  pilotage: (
    <>
      <circle cx="8" cy="8" r="5.8" />
      <path d="M8 4.6V8l2.4 1.5" />
    </>
  ),
  contact: (
    <>
      <rect x="2" y="3.2" width="12" height="9.6" rx="1.5" />
      <path d="m2.4 4.2 5.6 4.4 5.6-4.4" />
    </>
  ),
};

function iconFor(href) {
  const key = String(href || '')
    .replace('#', '')
    .toLowerCase();
  return NAV_ICONS[key] || NAV_ICONS.accueil;
}

export default function Nav({ preference, setPreference, resolved }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [copied, setCopied] = useState('');
  const ctxRef = useRef(null);
  const theme = resolved === 'light' ? 'light' : 'dark';
  const isDark = (preference === 'system' ? resolved : preference) === 'dark';
  const toggleTheme = () => setPreference(isDark ? 'light' : 'dark');

  const dockItems = useMemo(
    () =>
      nav.links.map((link) => ({
        id: link.href.replace('#', ''),
        label: link.label,
        href: link.href,
        icon: iconFor(link.href),
      })),
    [],
  );

  const ghostIcon = useMemo(
    () =>
      isDark ? (
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
      ),
    [isDark],
  );

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
    document.documentElement.classList.toggle('nav-menu-open', mobileOpen);
    document.body.classList.toggle('nav-menu-open', mobileOpen);
    return () => {
      document.documentElement.classList.remove('nav-menu-open');
      document.body.classList.remove('nav-menu-open');
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

  return (
    <>
      <div className={`site-nav site-nav--dock site-nav--${theme}`} data-theme={theme}>
        <div className="site-nav__dock-frame shader-frame">
          <AnimatedTopDock
            variant="modern"
            proximity={122}
            spring={0.19}
            damping={0.7}
            widthGrowth={17}
            heightGrowth={16}
            drop={3.5}
            chromeOnly
            brandLabel={identity.wordmark}
            brandHref="#accueil"
            items={dockItems}
            ghostLabel={ghostIcon}
            ghostAriaLabel={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            onGhostClick={toggleTheme}
            ctaLabel={nav.orcid}
            ctaHref={contacts.orcid}
            className="site-nav__atd"
          />
        </div>

        <div className="site-nav__mobile-bar">
          <a href="#accueil" className="site-nav__mobile-brand wordmark">
            {identity.wordmark}
          </a>
          <div className="site-nav__mobile-actions">
            <ThemeOrb isDark={isDark} onToggle={toggleTheme} className="theme-orb--nav" />
            <button
              type="button"
              className="nav-burger site-nav__burger"
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
      </div>

      <div
        className={`mobile-menu__backdrop ${mobileOpen ? 'is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />

      <aside
        id="mobile-menu"
        className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
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
            <ThemeOrb isDark={isDark} onToggle={toggleTheme} />
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
      </aside>

      {ctx && (
        <div ref={ctxRef} className="ctx-menu" style={{ left: ctx.x, top: ctx.y }} role="menu">
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

import { useEffect, useRef, useState } from 'react';
import { a11y, contacts, footer, identity, nav } from '../content';

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

function ThemeToggle({ preference, setPreference, resolved, className = '' }) {
  const active = preference === 'system' ? resolved : preference;

  return (
    <div className={`theme-switch theme-switch--nav ${className}`.trim()} role="group" aria-label="Thème">
      <button
        type="button"
        className={active === 'light' ? 'is-active' : ''}
        aria-pressed={active === 'light'}
        onClick={() => setPreference('light')}
      >
        {footer.theme.light}
      </button>
      <button
        type="button"
        className={active === 'dark' ? 'is-active' : ''}
        aria-pressed={active === 'dark'}
        onClick={() => setPreference('dark')}
      >
        {footer.theme.dark}
      </button>
    </div>
  );
}

export default function Nav({ preference, setPreference, resolved }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ctx, setCtx] = useState(null);
  const [copied, setCopied] = useState('');
  const ctxRef = useRef(null);

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
            className="wordmark"
            onContextMenu={onWordmarkContext}
            aria-label={`${identity.wordmark} — accueil`}
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
              className="btn btn--secondary btn--sm"
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

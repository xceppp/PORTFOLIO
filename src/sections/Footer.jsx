import { handleHashLinkClick } from '../bits/smoothScroll';
import { a11y, contacts, footer, identity } from '../content';

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

function FooterLink({ link }) {
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
        <ExternalHint />
      </a>
    );
  }
  return (
    <a href={link.href} onClick={(e) => handleHashLinkClick(e, link.href)}>
      {link.label}
    </a>
  );
}

function DossierPoem({ title, links }) {
  const mid = Math.ceil(links.length / 2);
  const left = links.slice(0, mid);
  const right = links.slice(mid);

  return (
    <div className="footer-poem">
      <p className="footer-poem__title">{title}</p>
      <div className="footer-poem__verse">
        <ul className="footer-poem__col">
          {left.map((link) => (
            <li key={link.label}>
              <FooterLink link={link} />
            </li>
          ))}
        </ul>
        <ul className="footer-poem__col">
          {right.map((link) => (
            <li key={link.label}>
              <FooterLink link={link} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const MOBILE_PROFILES = [
  { label: 'LinkedIn', href: contacts.linkedin, external: true },
  { label: 'Scopus', href: contacts.scopus, external: true },
  { label: 'SciProfiles', href: contacts.sciprofiles, external: true },
  { label: 'ORCID', href: contacts.orcid, external: true },
];

export default function Footer({ preference, setPreference, resolved }) {
  const active = preference === 'system' ? resolved : preference;
  const isDark = active === 'dark';
  const dossier = footer.columns.find((col) => col.title === 'Dossier');
  const compactLinks = (dossier?.links ?? []).slice(0, 6);

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__mobile">
          <a
            href="#accueil"
            className="wordmark site-footer__mobile-brand"
            onClick={(e) => handleHashLinkClick(e, '#accueil')}
          >
            {identity.wordmark}
          </a>
          <nav className="site-footer__mobile-nav" aria-label="Pied de page">
            {compactLinks.map((link) => (
              <FooterLink key={link.label} link={link} />
            ))}
          </nav>
          <nav className="site-footer__mobile-profiles" aria-label="Profils scientifiques">
            <p className="site-footer__mobile-profiles-label">Profils</p>
            <div className="site-footer__mobile-profiles-links">
              {MOBILE_PROFILES.map((link) => (
                <FooterLink key={link.label} link={link} />
              ))}
            </div>
          </nav>
          <div className="site-footer__mobile-bottom">
            <p>{footer.copyright}</p>
            <button
              type="button"
              className={`theme-orb theme-orb--footer ${isDark ? 'is-dark' : 'is-light'}`}
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              onClick={() => setPreference(isDark ? 'light' : 'dark')}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12.2 2.1a9.9 9.9 0 0 0 0 19.8 9.9 9.9 0 0 0 8.7-5.2 8.2 8.2 0 1 1-8.7-14.6Z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5" />
                  </g>
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="site-footer__desktop">
          <div className="site-footer__brand">
            <a
              href="#accueil"
              className="wordmark"
              onClick={(e) => handleHashLinkClick(e, '#accueil')}
            >
              {identity.wordmark}
            </a>
          </div>

          <div className="site-footer__cols">
            {footer.columns.map((col) =>
              col.title === 'Dossier' ? (
                <DossierPoem key={col.title} title={col.title} links={col.links} />
              ) : (
                <div key={col.title} className="site-footer__col">
                  <p className="mega__title">{col.title}</p>
                  <ul>
                    {col.links.map((link) => (
                      <li key={col.title + link.label}>
                        <FooterLink link={link} />
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            )}
          </div>

          <div className="site-footer__bottom">
            <p>{footer.copyright}</p>
            <button
              type="button"
              className={`theme-orb theme-orb--footer ${isDark ? 'is-dark' : 'is-light'}`}
              aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              onClick={() => setPreference(isDark ? 'light' : 'dark')}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M12.2 2.1a9.9 9.9 0 0 0 0 19.8 9.9 9.9 0 0 0 8.7-5.2 8.2 8.2 0 1 1-8.7-14.6Z"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <circle cx="12" cy="12" r="4.2" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M18.8 5.2l-1.5 1.5M6.7 17.3l-1.5 1.5" />
                  </g>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { a11y, footer, identity } from '../content';

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
  return <a href={link.href}>{link.label}</a>;
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

export default function Footer({ preference, setPreference, resolved }) {
  const active = preference === 'system' ? resolved : preference;
  const isDark = active === 'dark';

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__brand">
          <a href="#accueil" className="wordmark">
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
    </footer>
  );
}

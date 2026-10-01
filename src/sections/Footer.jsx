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

export default function Footer({ preference, setPreference }) {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__top">
          <a href="#accueil" className="wordmark">
            {identity.wordmark}
          </a>
          <div className="site-footer__cols">
            {footer.columns.map((col) =>
              col.title === 'Dossier' ? (
                <DossierPoem key={col.title} title={col.title} links={col.links} />
              ) : (
                <div key={col.title}>
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
        </div>
        <div className="site-footer__bottom">
          <p>{footer.copyright}</p>
          <div className="theme-switch" role="group" aria-label="Thème">
            {[
              ['system', footer.theme.system],
              ['light', footer.theme.light],
              ['dark', footer.theme.dark],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={preference === value ? 'is-active' : ''}
                aria-pressed={preference === value}
                onClick={() => setPreference(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

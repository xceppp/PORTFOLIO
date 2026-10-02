import { useState } from 'react';
import DecryptedText from '../bits/DecryptedText';
import MetalCta from '../bits/MetalCta';
import { a11y, contact, contacts } from '../content';

function ExternalHint() {
  return <span className="visually-hidden"> {a11y.newTab}</span>;
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contacts.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <section id={contact.id} className="section contact">
      <div className="shell blueprint-section contact__inner">
        <h2 className="section-title contact__title">{contact.title}</h2>
        <div className="contact__actions">
          <MetalCta label={contact.writeEmail} href={`mailto:${contacts.email}`} />
          <MetalCta
            label={copied ? contact.copied : contact.copyEmail}
            onClick={copyEmail}
          />
        </div>

        <ul className="contact__profiles">
          <li>
            <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <ExternalHint />
            </a>
          </li>
          <li>
            <a href={contacts.orcid} target="_blank" rel="noopener noreferrer">
              ORCID{' '}
              <DecryptedText text={contacts.orcidId} className="mono" as="span" />
              <ExternalHint />
            </a>
          </li>
          <li>
            <a href={contacts.scopus} target="_blank" rel="noopener noreferrer">
              Scopus <span className="mono">{contacts.scopusId}</span>
              <ExternalHint />
            </a>
          </li>
          <li>
            <a href={contacts.sciprofiles} target="_blank" rel="noopener noreferrer">
              SciProfiles
              <ExternalHint />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}

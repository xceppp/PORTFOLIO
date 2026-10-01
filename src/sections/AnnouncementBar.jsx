import { useState } from 'react';
import { announcement } from '../content';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('chalh-announce-dismissed') === '1';
    } catch {
      return false;
    }
  });

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('chalh-announce-dismissed', '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="announce" role="region" aria-label="Annonce">
      <a href={announcement.href} className="announce__link">
        {announcement.text}
      </a>
      <button type="button" className="announce__close" onClick={dismiss} aria-label="Fermer l'annonce">
        ×
      </button>
    </div>
  );
}

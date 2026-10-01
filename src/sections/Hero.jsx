import { useEffect, useState } from 'react';
import DecodeCycle from '../bits/DecodeCycle';
import HeroName from '../bits/HeroName';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { hero } from '../content';

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return undefined;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % hero.rotating.length);
    }, 3200);
    return () => clearInterval(id);
  }, [reduced]);

  const phrase = hero.rotating[reduced ? 0 : index];

  return (
    <section id="accueil" className="hero" aria-label="Accueil">
      <div className="hero__media" aria-hidden="true">
        <div className="hero__bg" />
        <div className="hero__grid" />
      </div>

      <div className="hero__content shell">
        <HeroName text={hero.name} />
        <p className="hero__title">{hero.title}</p>

        <div className="hero__rotate">
          <DecodeCycle text={phrase.label} className="hero__rotate-label mono" as="p" />
          <DecodeCycle text={phrase.support} className="hero__rotate-support" as="p" />
        </div>

        <div className="hero__actions">
          <a className="btn btn--primary" href={hero.ctaPrimaryHref}>
            {hero.ctaPrimary}
          </a>
          <a className="text-link" href={hero.ctaSecondaryHref}>
            {hero.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

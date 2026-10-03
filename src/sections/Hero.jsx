import { useEffect, useState } from 'react';
import DecodeCycle from '../bits/DecodeCycle';
import HeroName from '../bits/HeroName';
import MetalCta from '../bits/MetalCta';
import { handleHashLinkClick, smoothScrollTo } from '../bits/smoothScroll';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { hero } from '../content';

function scrollToManifeste() {
  smoothScrollTo('manifeste');
}

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
          <MetalCta label={hero.ctaPrimary} href={hero.ctaPrimaryHref} />
          <a
            className="text-link"
            href={hero.ctaSecondaryHref}
            onClick={(e) => handleHashLinkClick(e, hero.ctaSecondaryHref)}
          >
            {hero.ctaSecondary}
          </a>
        </div>
      </div>

      <button
        type="button"
        className="hero__skip"
        aria-label="Descendre vers le manifeste"
        onClick={scrollToManifeste}
      >
        <span className="hero__skip-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M6.5 9.5 12 15l5.5-5.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
    </section>
  );
}

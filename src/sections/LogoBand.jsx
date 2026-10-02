import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { establishments } from '../content';

function LogoItem({ name, logo, wide }) {
  const classes = ['logo-band__item', wide ? 'is-wide' : ''].filter(Boolean).join(' ');

  return (
    <div className={classes} title={name} data-logo={name}>
      <img
        className="logo-band__logo"
        src={logo}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

function LogoGroup({ items, ariaHidden = false, suffix = '' }) {
  return (
    <div className="logo-band__group" aria-hidden={ariaHidden || undefined}>
      {items.map((item, i) => (
        <LogoItem
          key={`${item.id}${suffix}-${i}`}
          name={item.name}
          logo={item.logo}
          wide={item.wide}
        />
      ))}
    </div>
  );
}

export default function LogoBand() {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef(null);
  /* Duplicate inside each half so the strip always wider than the viewport */
  const sequence = [...establishments, ...establishments];

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-offscreen', !entry.isIntersecting);
      },
      { rootMargin: '120px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div ref={rootRef} className="logo-band" aria-label="Établissements du parcours">
      <div className={`logo-band__viewport ${reduced ? 'is-static' : ''}`}>
        <div className={`logo-band__track ${reduced ? '' : 'is-marquee'}`}>
          <LogoGroup items={sequence} suffix="-a" />
          {!reduced ? <LogoGroup items={sequence} ariaHidden suffix="-b" /> : null}
        </div>
      </div>
    </div>
  );
}

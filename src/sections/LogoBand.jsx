import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/useTheme';
import { establishments } from '../content';

function LogoItem({ name, logo, logos, wide, tone }) {
  const classes = [
    'logo-band__item',
    wide ? 'is-wide' : '',
    logos ? 'is-pair' : '',
    tone ? `tone-${tone}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} title={name} data-logo={name}>
      {logos ? (
        <div className="logo-band__pair">
          {logos.map((src) => (
            <img
              key={src}
              className="logo-band__logo logo-band__logo--part"
              src={src}
              alt=""
              loading="lazy"
              decoding="async"
            />
          ))}
          <span className="visually-hidden">{name}</span>
        </div>
      ) : (
        <img
          className="logo-band__logo"
          src={logo}
          alt={name}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

export default function LogoBand() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (reduced) return undefined;
    const track = trackRef.current;
    if (!track) return undefined;

    let paused = false;
    const parent = track.parentElement;
    const onEnter = () => {
      paused = true;
    };
    const onLeave = () => {
      paused = false;
    };
    parent?.addEventListener('mouseenter', onEnter);
    parent?.addEventListener('mouseleave', onLeave);

    const speed = 0.45;
    const tick = () => {
      if (!paused && track) {
        offsetRef.current -= speed;
        const first = track.firstElementChild;
        if (first) {
          const gap = 44;
          const firstWidth = first.getBoundingClientRect().width + gap;
          if (Math.abs(offsetRef.current) >= firstWidth) {
            offsetRef.current += firstWidth;
            track.appendChild(first);
          }
        }
        track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      parent?.removeEventListener('mouseenter', onEnter);
      parent?.removeEventListener('mouseleave', onLeave);
    };
  }, [reduced]);

  return (
    <div className="logo-band" aria-label="Établissements du parcours">
      <div className={`logo-band__viewport ${reduced ? 'is-static' : ''}`}>
        <div className="logo-band__track" ref={trackRef}>
          {establishments.map((item) => (
            <LogoItem
              key={item.id}
              name={item.name}
              logo={item.logo}
              logos={item.logos}
              wide={item.wide}
              tone={item.tone}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

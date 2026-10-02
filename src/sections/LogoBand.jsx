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
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

function LogoGroup({ items, ariaHidden = false }) {
  return (
    <div className="logo-band__group" aria-hidden={ariaHidden || undefined}>
      {items.map((item) => (
        <LogoItem
          key={item.id}
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
  /* Duplicate inside each half so the strip always wider than the viewport */
  const sequence = [...establishments, ...establishments];

  return (
    <div className="logo-band" aria-label="Établissements du parcours">
      <div className={`logo-band__viewport ${reduced ? 'is-static' : ''}`}>
        <div className={`logo-band__track ${reduced ? '' : 'is-marquee'}`}>
          <LogoGroup items={sequence} />
          {!reduced ? <LogoGroup items={sequence} ariaHidden /> : null}
        </div>
      </div>
    </div>
  );
}

import { usePrefersReducedMotion } from '../hooks/useTheme';
import { establishments } from '../content';

function LogoItem({ name, logo, wide }) {
  const classes = ['logo-band__item', wide ? 'is-wide' : ''].filter(Boolean).join(' ');

  return (
    <div className={classes} title={name} data-logo={name}>
      <img
        className="logo-band__logo"
        src={logo}
        alt={name}
        loading="eager"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

export default function LogoBand() {
  const reduced = usePrefersReducedMotion();
  const loop = [...establishments, ...establishments];

  return (
    <div className="logo-band" aria-label="Établissements du parcours">
      <div className={`logo-band__viewport ${reduced ? 'is-static' : ''}`}>
        <div className={`logo-band__track ${reduced ? '' : 'is-marquee'}`}>
          {loop.map((item, i) => (
            <LogoItem
              key={`${item.id}-${i}`}
              name={item.name}
              logo={item.logo}
              wide={item.wide}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

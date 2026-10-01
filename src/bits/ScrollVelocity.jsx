import { usePrefersReducedMotion } from '../hooks/useTheme';

export default function ScrollVelocity({
  items,
  velocity = 1,
  className = '',
  separator = ' · ',
  pauseOnHover = true,
}) {
  const reduced = usePrefersReducedMotion();
  const line = items.join(separator);

  if (reduced) {
    return (
      <div className={`scroll-velocity is-static ${className}`.trim()}>
        <div className="scroll-velocity__track">
          <span>{line}</span>
        </div>
      </div>
    );
  }

  const duration = Math.max(18, 40 / Math.abs(velocity));
  const reverse = velocity < 0;

  return (
    <div
      className={`scroll-velocity ${pauseOnHover ? 'pause-hover' : ''} ${className}`.trim()}
      style={{
        '--sv-duration': `${duration}s`,
        '--sv-direction': reverse ? 'reverse' : 'normal',
      }}
    >
      <div className="scroll-velocity__track">
        <span aria-hidden="true">{line}{separator}</span>
        <span aria-hidden="true">{line}{separator}</span>
        <span className="visually-hidden">{line}</span>
      </div>
    </div>
  );
}

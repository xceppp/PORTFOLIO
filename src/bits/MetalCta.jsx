import { lazy, Suspense } from 'react';
import { smoothScrollTo } from './smoothScroll';
import { usePrefersReducedMotion, useTheme } from '../hooks/useTheme';

const LiquidMetalButton = lazy(() =>
  import('../threeui/LiquidMetalButton').then((m) => ({ default: m.LiquidMetalButton })),
);

function activateTarget(href, onClick) {
  if (typeof onClick === 'function') {
    onClick();
    return;
  }
  if (!href) return;
  if (href.startsWith('#')) {
    const id = href.slice(1);
    if (document.getElementById(id)) {
      smoothScrollTo(id);
      try {
        history.pushState(null, '', href);
      } catch {
        /* ignore */
      }
    } else {
      window.location.hash = href;
    }
    return;
  }
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    window.location.href = href;
    return;
  }
  window.open(href, '_blank', 'noopener,noreferrer');
}

/**
 * Theme-aware LiquidMetalButton pill CTA for site actions.
 */
export default function MetalCta({
  label,
  href,
  onClick,
  className = '',
  ariaLabel,
}) {
  const { resolved } = useTheme();
  const reduced = usePrefersReducedMotion();
  const text = String(label || '').slice(0, 24);
  const theme = resolved === 'light' ? 'light' : 'dark';

  if (reduced) {
    if (href) {
      return (
        <a
          className={`btn btn--primary ${className}`.trim()}
          href={href}
          aria-label={ariaLabel || text}
          onClick={(e) => {
            if (href.startsWith('#')) {
              e.preventDefault();
              activateTarget(href);
            }
          }}
        >
          {label}
        </a>
      );
    }
    return (
      <button
        type="button"
        className={`btn btn--primary ${className}`.trim()}
        onClick={onClick}
        aria-label={ariaLabel || text}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      className={`metal-cta shader-frame ${className}`.trim()}
      data-theme={theme}
      style={{
        '--metal-cta-chars': Math.max(6, text.length),
        width: `calc(1.35rem + ${Math.max(6, text.length)} * 0.46rem)`,
      }}
    >
      <Suspense fallback={<span className="metal-cta__fallback">{label}</span>}>
        <LiquidMetalButton
          variant="pill"
          text={text}
          embedded
          theme={theme}
          onClick={() => activateTarget(href, onClick)}
        />
      </Suspense>
      <span className="visually-hidden">{ariaLabel || label}</span>
    </div>
  );
}

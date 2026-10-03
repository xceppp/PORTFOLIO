function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function navOffsetPx() {
  if (typeof window === 'undefined') return 72;
  return window.matchMedia('(max-width: 900px)').matches ? 56 : 84;
}

function targetYForElement(el) {
  const top = el.getBoundingClientRect().top + window.scrollY - navOffsetPx();
  const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  return Math.max(0, Math.min(top, maxY));
}

let activeCancel = null;

/**
 * Smooth, eased scroll to a Y position (cancels any in-flight scroll).
 * @returns {() => void} cancel
 */
export function smoothScrollToY(y, { duration } = {}) {
  if (typeof window === 'undefined') return () => {};

  if (activeCancel) {
    activeCancel();
    activeCancel = null;
  }

  const startY = window.scrollY || window.pageYOffset;
  const delta = y - startY;
  if (Math.abs(delta) < 1) return () => {};

  if (prefersReducedMotion()) {
    window.scrollTo(0, y);
    return () => {};
  }

  const distance = Math.abs(delta);
  const ms = duration ?? Math.min(1400, Math.max(520, distance * 0.55));
  const prevBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';

  let raf = 0;
  const start = performance.now();
  let cancelled = false;

  const finish = () => {
    document.documentElement.style.scrollBehavior = prevBehavior;
    if (activeCancel === cancel) activeCancel = null;
  };

  const cancel = () => {
    cancelled = true;
    cancelAnimationFrame(raf);
    finish();
  };

  const tick = (now) => {
    if (cancelled) return;
    const t = Math.min(1, (now - start) / ms);
    window.scrollTo(0, startY + delta * easeInOutCubic(t));
    if (t < 1) raf = requestAnimationFrame(tick);
    else finish();
  };

  raf = requestAnimationFrame(tick);
  activeCancel = cancel;
  return cancel;
}

/** Scroll to an element or `#id` / `id` string with nav offset. */
export function smoothScrollTo(target) {
  if (typeof window === 'undefined' || !target) return () => {};

  let el = null;
  if (typeof target === 'string') {
    const id = target.startsWith('#') ? target.slice(1) : target;
    if (!id) return () => {};
    el = document.getElementById(id) || document.querySelector(target.startsWith('#') ? target : `#${id}`);
  } else if (target instanceof Element) {
    el = target;
  }

  if (!el) return () => {};
  return smoothScrollToY(targetYForElement(el));
}

/** Click handler helper for in-page hash links. */
export function handleHashLinkClick(event, href) {
  const raw = href || event?.currentTarget?.getAttribute?.('href');
  if (!raw || !raw.startsWith('#')) return false;
  const id = raw.slice(1);
  if (!id || !document.getElementById(id)) return false;
  event?.preventDefault?.();
  smoothScrollTo(id);
  try {
    history.pushState(null, '', `#${id}`);
  } catch {
    /* ignore */
  }
  return true;
}

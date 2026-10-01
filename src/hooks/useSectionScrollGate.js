import { useEffect } from 'react';

const NAV_OFFSET = 60;

function getSections() {
  return Array.from(document.querySelectorAll('#contenu > section'));
}

function sectionTop(section) {
  return Math.max(0, section.offsetTop - NAV_OFFSET);
}

/** Furthest scrollY allowed inside this section before it is cleared. */
function sectionCap(section) {
  const top = sectionTop(section);
  const bottom = section.offsetTop + section.offsetHeight;
  const vh = window.innerHeight;
  // Short section: pin at its start until cleared
  if (bottom - section.offsetTop <= vh - NAV_OFFSET + 12) {
    return top;
  }
  // Tall section: may scroll until its bottom sits on the viewport bottom
  return Math.max(top, bottom - vh);
}

function sectionCleared(section, scrollY) {
  const top = sectionTop(section);
  const bottom = section.offsetTop + section.offsetHeight;
  const vh = window.innerHeight;
  if (bottom - section.offsetTop <= vh - NAV_OFFSET + 12) {
    // Whole section fits — cleared once we have landed on it
    return scrollY + 24 >= top && scrollY + vh >= bottom - 8;
  }
  return scrollY + vh >= bottom - 8;
}

function indexForId(id) {
  return getSections().findIndex((el) => el.id === id);
}

/**
 * Hard gate: cannot enter the next section until the current one
 * has been fully shown (short: landed on it; tall: scrolled to its end).
 */
export default function useSectionScrollGate() {
  useEffect(() => {
    let gateIndex = 0;
    let touchStartY = 0;
    let ticking = false;
    let leaveArmed = false;

    const maxAllowedY = () => {
      const sections = getSections();
      if (!sections.length) return Number.POSITIVE_INFINITY;
      if (gateIndex >= sections.length) {
        return document.documentElement.scrollHeight;
      }
      return sectionCap(sections[gateIndex]);
    };

    const applyGate = () => {
      if (document.documentElement.dataset.autoScrolling === '1') return;
      const y = window.scrollY || window.pageYOffset;
      const sections = getSections();
      if (!sections.length) return;

      // If user scrolled up into an earlier section, pull the gate back
      for (let i = 0; i < sections.length; i += 1) {
        if (sectionTop(sections[i]) <= y + 40) {
          if (i < gateIndex && !sectionCleared(sections[i], y)) {
            gateIndex = i;
          }
        }
      }

      const cap = maxAllowedY();
      if (y > cap + 0.5) {
        window.scrollTo(0, cap);
      }
    };

    const tryAdvance = (y) => {
      const sections = getSections();
      if (!sections.length || gateIndex >= sections.length) return false;
      const current = sections[gateIndex];
      const cap = sectionCap(current);
      if (y + 1 < cap) return false;
      if (!sectionCleared(current, Math.max(y, cap))) return false;
      gateIndex = Math.min(gateIndex + 1, sections.length);
      return true;
    };

    const onWheel = (e) => {
      if (document.documentElement.dataset.autoScrolling === '1') return;
      if (e.deltaY <= 0) {
        leaveArmed = false;
        applyGate();
        return;
      }

      const y = window.scrollY || window.pageYOffset;
      const cap = maxAllowedY();

      if (y >= cap - 1) {
        // Pin at section end; require a second scroll to enter the next one
        e.preventDefault();
        window.scrollTo(0, cap);
        if (leaveArmed) {
          tryAdvance(cap);
          leaveArmed = false;
        } else {
          leaveArmed = true;
        }
        return;
      }

      leaveArmed = false;
      if (y + e.deltaY > cap) {
        e.preventDefault();
        window.scrollTo(0, cap);
        leaveArmed = true;
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        applyGate();
      });
    };

    const onTouchStart = (e) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e) => {
      if (document.documentElement.dataset.autoScrolling === '1') return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const goingDown = currentY < touchStartY - 4;
      if (!goingDown) return;

      const y = window.scrollY || window.pageYOffset;
      const cap = maxAllowedY();

      if (y >= cap - 1) {
        e.preventDefault();
        window.scrollTo(0, cap);
        if (leaveArmed) {
          tryAdvance(cap);
          leaveArmed = false;
        } else {
          leaveArmed = true;
        }
        touchStartY = currentY;
        return;
      }

      leaveArmed = false;
      if (y > cap) {
        e.preventDefault();
        window.scrollTo(0, cap);
        leaveArmed = true;
      }
    };

    const onKeyDown = (e) => {
      if (document.documentElement.dataset.autoScrolling === '1') return;
      const keys = ['PageDown', ' ', 'ArrowDown', 'End'];
      if (!keys.includes(e.key)) return;
      const y = window.scrollY || window.pageYOffset;
      const cap = maxAllowedY();
      if (y >= cap - 1) {
        e.preventDefault();
        if (leaveArmed) {
          tryAdvance(cap);
          leaveArmed = false;
        } else {
          leaveArmed = true;
        }
        return;
      }
      leaveArmed = false;
      if (e.key === 'End' || y + window.innerHeight > cap) {
        e.preventDefault();
        window.scrollTo(0, cap);
        leaveArmed = true;
      }
    };

    const onGateTo = (e) => {
      const id = e.detail?.id;
      if (!id) return;
      const idx = indexForId(id);
      if (idx >= 0) {
        gateIndex = idx;
        leaveArmed = false;
      }
      applyGate();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('keydown', onKeyDown, { passive: false });
    window.addEventListener('scroll-gate-to', onGateTo);

    applyGate();

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll-gate-to', onGateTo);
    };
  }, []);
}

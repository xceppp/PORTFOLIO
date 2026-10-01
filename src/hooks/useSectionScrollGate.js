import { useEffect } from 'react';

const NAV_OFFSET = 60;

function getSections() {
  return Array.from(document.querySelectorAll('#contenu > section'));
}

function sectionLimit(section) {
  return Math.max(0, section.offsetTop + section.offsetHeight - window.innerHeight);
}

function currentSectionIndex(scrollY) {
  const sections = getSections();
  let index = 0;
  for (let i = 0; i < sections.length; i += 1) {
    if (sections[i].offsetTop - NAV_OFFSET <= scrollY + 48) index = i;
  }
  return index;
}

function isFullyShown(section, scrollY) {
  const bottom = section.offsetTop + section.offsetHeight;
  return scrollY + window.innerHeight >= bottom - 6;
}

/**
 * Block advancing to the next section until the current section’s
 * full content has been brought into view.
 */
export default function useSectionScrollGate() {
  useEffect(() => {
    let touching = false;
    let touchStartY = 0;

    const clampIfNeeded = () => {
      if (document.documentElement.dataset.autoScrolling === '1') return;
      const y = window.scrollY || window.pageYOffset;
      const sections = getSections();
      if (!sections.length) return;
      const index = currentSectionIndex(y);
      const section = sections[index];
      if (!section || isFullyShown(section, y)) return;
      const limit = sectionLimit(section);
      if (y > limit + 1) {
        window.scrollTo(0, limit);
      }
    };

    const onWheel = (e) => {
      if (document.documentElement.dataset.autoScrolling === '1') return;
      if (e.deltaY <= 0) return;
      const y = window.scrollY || window.pageYOffset;
      const sections = getSections();
      if (!sections.length) return;
      const index = currentSectionIndex(y);
      const section = sections[index];
      if (!section || isFullyShown(section, y)) return;
      const limit = sectionLimit(section);
      if (y + e.deltaY > limit) {
        e.preventDefault();
        if (Math.abs(y - limit) > 1) window.scrollTo(0, limit);
      }
    };

    const onTouchStart = (e) => {
      touching = true;
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e) => {
      if (!touching || document.documentElement.dataset.autoScrolling === '1') return;
      const currentY = e.touches[0]?.clientY ?? 0;
      const goingDown = currentY < touchStartY - 2;
      if (!goingDown) return;
      const y = window.scrollY || window.pageYOffset;
      const sections = getSections();
      if (!sections.length) return;
      const index = currentSectionIndex(y);
      const section = sections[index];
      if (!section || isFullyShown(section, y)) return;
      const limit = sectionLimit(section);
      if (y >= limit - 1) {
        e.preventDefault();
        window.scrollTo(0, limit);
      }
    };

    const onTouchEnd = () => {
      touching = false;
      clampIfNeeded();
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', clampIfNeeded, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', clampIfNeeded);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}

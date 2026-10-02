import fs from 'fs';

const path = 'public/landing-pages/bestsellers-book-showcase.html';
let html = fs.readFileSync(path, 'utf8');

// --- Menu labels: Volumes/Notes/Index → axis names ---
html = html.replace(
  `<nav class="menu-layer" id="menuLayer" aria-label="Site menu" inert>
      <ul class="menu-list">
        <li><a class="menu-link" href="#" data-menu-close>Volumes</a></li>
        <li><a class="menu-link" href="#notes" data-menu-close data-toast="Field notes are coming soon.">Notes</a></li>
        <li><a class="menu-link" href="#index" data-menu-close data-toast="An index of tools for thought.">Index</a></li>
      </ul>
    </nav>`,
  `<nav class="menu-layer" id="menuLayer" aria-label="Axes de pilotage" inert>
      <ul class="menu-list">
        <li><a class="menu-link" href="#" data-menu-close data-select-book="codex">Projets</a></li>
        <li><a class="menu-link" href="#" data-menu-close data-select-book="claude">Gouvernance</a></li>
        <li><a class="menu-link" href="#" data-menu-close data-select-book="cursor">Partenaires</a></li>
      </ul>
    </nav>`,
);

// --- Mobile detail: show data panel in-viewport (not below fold) ---
const mobileCss = `
    /* CHALH mobile detail + swipe affordance */
    @media (max-width: 900px) {
      [data-mode="detail"] .stage {
        min-height: 100% !important;
        height: 100% !important;
        overflow: hidden !important;
      }

      [data-mode="detail"] .gallery {
        min-height: 100%;
      }

      [data-mode="detail"] .book-card.selected {
        left: 50% !important;
        top: 18% !important;
        width: min(46vw, 200px) !important;
        z-index: 8 !important;
      }

      [data-mode="detail"] .detail-panel {
        position: fixed !important;
        top: auto !important;
        right: 0 !important;
        left: 0 !important;
        bottom: 0 !important;
        width: 100% !important;
        height: min(62svh, 520px) !important;
        max-height: 62svh !important;
        padding: 18px 18px 96px !important;
        opacity: 1 !important;
        transform: none !important;
        pointer-events: auto !important;
        z-index: 20 !important;
        overflow: hidden !important;
        background: color-mix(in srgb, var(--canvas) 92%, var(--surface)) !important;
        box-shadow: 0 -12px 40px rgba(0, 0, 0, 0.28) !important;
      }

      html[data-theme="light"] [data-mode="detail"] .detail-panel {
        background: color-mix(in srgb, #ffffff 90%, var(--canvas)) !important;
      }

      [data-mode="detail"] .detail-title {
        font-size: clamp(28px, 7vw, 40px) !important;
        margin-bottom: 0.35rem !important;
      }

      [data-mode="detail"] .detail-scroll {
        max-height: calc(62svh - 170px) !important;
        overflow-y: auto !important;
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        padding-right: 8px !important;
      }

      [data-mode="detail"] .bottom-dock {
        position: absolute !important;
        left: 12px !important;
        right: 12px !important;
        bottom: 10px !important;
        width: auto !important;
      }

      [data-mode="detail"] .close-button {
        top: 12px !important;
        right: 12px !important;
        z-index: 30 !important;
      }

      .gallery {
        touch-action: pan-y;
      }
    }
`;

if (!html.includes('CHALH mobile detail + swipe')) {
  html = html.replace('  </style>\n</head>', `${mobileCss}\n  </style>\n</head>`);
}

// --- JS: swipe between books + menu select + mobile scroll into detail ---
const oldHandlers = `      cards.forEach((card) => {
        card.addEventListener("click", () => selectBook(card));
        card.addEventListener("pointerenter", () => card.dataset.hovered = "true");
        card.addEventListener("pointerleave", () => card.dataset.hovered = "false");
      });`;

const newHandlers = `      const bookOrder = ["codex", "claude", "cursor"];

      function cardByBook(id) {
        return cards.find((card) => card.dataset.book === id) || null;
      }

      function cycleBook(dir) {
        const currentId = selectedCard?.dataset?.book
          || document.querySelector(".book-card[data-hovered='true']")?.dataset?.book
          || "claude";
        const idx = Math.max(0, bookOrder.indexOf(currentId));
        const next = bookOrder[(idx + dir + bookOrder.length) % bookOrder.length];
        const card = cardByBook(next);
        if (!card) return;
        if (body.dataset.mode === "detail") {
          // Switch axis while staying in detail
          body.dataset.mode = "gallery";
          cards.forEach((c) => c.classList.remove("selected"));
          selectedCard = null;
        }
        selectBook(card);
      }

      let swipeX = null;
      let swipeY = null;
      let swipeActive = false;

      stage.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        swipeX = event.clientX;
        swipeY = event.clientY;
        swipeActive = true;
      }, { passive: true });

      stage.addEventListener("pointerup", (event) => {
        if (!swipeActive || swipeX == null) return;
        const dx = event.clientX - swipeX;
        const dy = event.clientY - swipeY;
        swipeActive = false;
        swipeX = null;
        swipeY = null;
        if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
        // Avoid stealing taps on buttons/links
        if (event.target.closest("button, a, .detail-scroll, .bottom-dock")) return;
        cycleBook(dx < 0 ? 1 : -1);
      }, { passive: true });

      stage.addEventListener("pointercancel", () => {
        swipeActive = false;
        swipeX = null;
        swipeY = null;
      });

      document.addEventListener("keydown", (event) => {
        if (body.dataset.menu === "open") return;
        if (event.key === "ArrowRight") {
          event.preventDefault();
          cycleBook(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          cycleBook(-1);
        }
      });

      cards.forEach((card) => {
        card.addEventListener("click", () => selectBook(card));
        card.addEventListener("pointerenter", () => card.dataset.hovered = "true");
        card.addEventListener("pointerleave", () => card.dataset.hovered = "false");
      });`;

if (!html.includes('function cycleBook(dir)')) {
  html = html.replace(oldHandlers, newHandlers);
}

// After selectBook on mobile, keep detail panel in view (no need to scroll stage)
html = html.replace(
  `window.setTimeout(() => {
          closeButton.focus({ preventScroll: true });
          if (window.innerWidth > 900) stage.scrollTop = 0;
        }, reducedMotion.matches ? 0 : 700);`,
  `window.setTimeout(() => {
          closeButton.focus({ preventScroll: true });
          stage.scrollTop = 0;
          if (window.innerWidth <= 900) {
            detailScroll.scrollTop = 0;
            detailPanel.scrollTop = 0;
          }
        }, reducedMotion.matches ? 0 : 120);`,
);

// Menu item selects book
html = html.replace(
  `if (event.target.closest("[data-menu-close]")) {
          toggleMenu(false);
        }`,
  `const menuClose = event.target.closest("[data-menu-close]");
        if (menuClose) {
          const bookId = menuClose.getAttribute("data-select-book");
          toggleMenu(false);
          if (bookId) {
            const card = cardByBook(bookId);
            if (card) {
              if (body.dataset.mode === "detail") {
                body.dataset.mode = "gallery";
                cards.forEach((c) => c.classList.remove("selected"));
                selectedCard = null;
              }
              selectBook(card);
            }
          }
        }`,
);

// Reduce lag: skip continuous parallax on coarse pointers / small screens
html = html.replace(
  `window.addEventListener("pointermove", (event) => {
        pointerX = event.clientX / window.innerWidth - .5;
        pointerY = event.clientY / window.innerHeight - .5;
        pointerClientX = event.clientX;
        pointerClientY = event.clientY;
        if (!frame) frame = window.requestAnimationFrame(updateParallax);
      }, { passive: true });`,
  `const coarsePointer = window.matchMedia("(pointer: coarse)");
      window.addEventListener("pointermove", (event) => {
        if (coarsePointer.matches || window.innerWidth <= 900) return;
        pointerX = event.clientX / window.innerWidth - .5;
        pointerY = event.clientY / window.innerHeight - .5;
        pointerClientX = event.clientX;
        pointerClientY = event.clientY;
        if (!frame) frame = window.requestAnimationFrame(updateParallax);
      }, { passive: true });`,
);

fs.writeFileSync(path, html);
console.log({
  menu: html.includes('data-select-book="codex"') && html.includes('>Projets</a>'),
  swipe: html.includes('function cycleBook(dir)'),
  mobile: html.includes('CHALH mobile detail + swipe'),
  coarse: html.includes('pointer: coarse'),
});

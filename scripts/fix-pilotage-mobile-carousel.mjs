import fs from 'fs';

const path = 'public/landing-pages/bestsellers-book-showcase.html';
let html = fs.readFileSync(path, 'utf8');

const carouselCss = `
    /* CHALH mobile carousel — one axis at a time */
    @media (max-width: 900px) {
      .book-card[data-book="codex"],
      .book-card[data-book="claude"],
      .book-card[data-book="cursor"] {
        left: 50% !important;
        top: 44% !important;
        width: min(68vw, 290px) !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transform: translate3d(-50%, -50%, 0) scale(0.92) !important;
        transition: opacity 280ms ease, transform 320ms ease !important;
        z-index: 1 !important;
      }

      .book-card.is-focus {
        opacity: 1 !important;
        pointer-events: auto !important;
        transform: translate3d(-50%, -50%, 0) scale(1) !important;
        z-index: 4 !important;
      }

      [data-mode="detail"] .book-card.is-focus,
      [data-mode="detail"] .book-card.selected {
        top: 18% !important;
        width: min(46vw, 200px) !important;
        opacity: 1 !important;
        pointer-events: none !important;
      }

      [data-mode="gallery"] .hero-word {
        opacity: 0.1 !important;
      }
    }
`;

if (!html.includes('CHALH mobile carousel')) {
  html = html.replace(
    '/* CHALH mobile detail + swipe affordance */',
    `${carouselCss}\n    /* CHALH mobile detail + swipe affordance */`,
  );
}

// Inject focus carousel logic after bookOrder
const focusLogic = `
      let focusIndex = 1; // start on Gouvernance (center)

      function setFocusIndex(next) {
        focusIndex = (next + bookOrder.length) % bookOrder.length;
        const id = bookOrder[focusIndex];
        cards.forEach((card) => {
          const on = card.dataset.book === id;
          card.classList.toggle("is-focus", on);
          card.dataset.hovered = on ? "true" : "false";
          card.tabIndex = on ? 0 : -1;
        });
      }

      setFocusIndex(focusIndex);
`;

if (!html.includes('function setFocusIndex(next)')) {
  html = html.replace(
    'const bookOrder = ["codex", "claude", "cursor"];',
    `const bookOrder = ["codex", "claude", "cursor"];\n${focusLogic}`,
  );
}

html = html.replace(
  `function cycleBook(dir) {
        const currentId = selectedCard?.dataset?.book
          || document.querySelector(".book-card[data-hovered='true']")?.dataset?.book
          || "claude";
        const idx = Math.max(0, bookOrder.indexOf(currentId));
        const next = bookOrder[(idx + dir + bookOrder.length) % bookOrder.length];
        const card = cardByBook(next);
        if (!card) return;
        selectBook(card);
      }`,
  `function cycleBook(dir) {
        if (body.dataset.mode === "detail") {
          const currentId = selectedCard?.dataset?.book || bookOrder[focusIndex];
          const idx = Math.max(0, bookOrder.indexOf(currentId));
          const card = cardByBook(bookOrder[(idx + dir + bookOrder.length) % bookOrder.length]);
          if (card) {
            focusIndex = bookOrder.indexOf(card.dataset.book);
            setFocusIndex(focusIndex);
            selectBook(card);
          }
          return;
        }
        setFocusIndex(focusIndex + dir);
      }`,
);

// Opening a book syncs focus index
html = html.replace(
  `selectedCard = card;
        selectedCard.style.setProperty("--detail-yaw", "-5deg");`,
  `selectedCard = card;
        focusIndex = Math.max(0, bookOrder.indexOf(card.dataset.book));
        setFocusIndex(focusIndex);
        selectedCard.style.setProperty("--detail-yaw", "-5deg");`,
);

fs.writeFileSync(path, html);
console.log({
  carousel: html.includes('CHALH mobile carousel'),
  focus: html.includes('function setFocusIndex(next)'),
  cycle: html.includes('setFocusIndex(focusIndex + dir)'),
});

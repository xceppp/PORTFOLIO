import fs from 'fs';

const path = 'public/landing-pages/bestsellers-book-showcase.html';
let h = fs.readFileSync(path, 'utf8');

h = h.replace(
  `function selectBook(card) {
        if (body.dataset.mode === "detail") return;
        const data = books[card.dataset.book];
        if (!data) return;`,
  `function selectBook(card) {
        const data = books[card.dataset.book];
        if (!data) return;
        if (body.dataset.mode === "detail" && selectedCard === card) return;`,
);

h = h.replace(
  `if (body.dataset.mode === "detail") {
          // Switch axis while staying in detail
          body.dataset.mode = "gallery";
          cards.forEach((c) => c.classList.remove("selected"));
          selectedCard = null;
        }
        selectBook(card);`,
  `selectBook(card);`,
);

// Menu path still resets — simplify to selectBook only
h = h.replace(
  `if (bookId) {
            const card = cardByBook(bookId);
            if (card) {
              if (body.dataset.mode === "detail") {
                body.dataset.mode = "gallery";
                cards.forEach((c) => c.classList.remove("selected"));
                selectedCard = null;
              }
              selectBook(card);
            }
          }`,
  `if (bookId) {
            const card = cardByBook(bookId);
            if (card) selectBook(card);
          }`,
);

fs.writeFileSync(path, h);
console.log({
  guard: h.includes('selectedCard === card'),
  earlyReturnGone: !h.includes('if (body.dataset.mode === "detail") return;'),
});

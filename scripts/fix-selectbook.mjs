import fs from 'fs';

const path = 'public/landing-pages/bestsellers-book-showcase.html';
let h = fs.readFileSync(path, 'utf8');

if (!h.includes('function openBook(card)')) {
  console.error('openBook missing — apply book close-then-open patch manually');
  process.exit(1);
}

console.log({
  openBook: h.includes('function openBook(card)'),
  pendingOpen: h.includes('pendingOpenCard'),
  closeThenOpen: h.includes('Return to the three books'),
});

import fs from 'fs';

const path = 'public/landing-pages/bestsellers-book-showcase.html';
let html = fs.readFileSync(path, 'utf8');

const covers = [
  {
    book: 'codex',
    color: '#1a221c',
    url: "/landing-pages/covers/cover-projets.jpg",
  },
  {
    book: 'claude',
    color: '#1c1812',
    url: "/landing-pages/covers/cover-gouvernance.jpg",
  },
  {
    book: 'cursor',
    color: '#121a1c',
    url: "/landing-pages/covers/cover-partenaires.jpg",
  },
];

let idx = 0;
html = html.replace(
  /--cover-color:\s*[^;]+;\s*\n\s*--cover:\s*url\('[^']+'\);/g,
  () => {
    const item = covers[idx];
    idx += 1;
    if (!item) throw new Error('unexpected extra cover block');
    return `--cover-color: ${item.color};\n          --cover: url('${item.url}');`;
  },
);

if (idx !== 3) {
  // Fallback: replace --cover: none or remaining data URLs near books
  throw new Error(`Expected 3 cover replacements, got ${idx}`);
}

// Hide motion videos so custom axis art stays crisp
html = html.replace(
  `.cover-motion {
      display: block !important;
    }

    .cover-motion[data-ready="true"] {
      opacity: 1 !important;
    }

    /* Fallback: once the video has a frame, keep motion art visible */
    .cover-motion:not([data-ready="true"]) {
      opacity: 0;
    }`,
  `.cover-motion {
      display: none !important;
      opacity: 0 !important;
    }`,
);

// Light ink on dark thematic covers
html = html.replace(
  `.book-card[data-book="codex"] .cover-copy {
      --cover-ink: #1c1f23 !important;
    }

    .book-card[data-book="claude"] .cover-copy {
      --cover-ink: #15171a !important;
    }

    .book-card[data-book="cursor"] .cover-copy {
      --cover-ink: #0f1113 !important;
    }`,
  `.book-card[data-book="codex"] .cover-copy,
    .book-card[data-book="claude"] .cover-copy,
    .book-card[data-book="cursor"] .cover-copy {
      --cover-ink: #f2efe8 !important;
    }`,
);

html = html.replace(
  `.cover-copy {
      color: var(--cover-ink) !important;
      text-shadow: 0 1px 0 rgba(241, 226, 196, 0.24) !important;
    }`,
  `.cover-copy {
      color: var(--cover-ink) !important;
      text-shadow:
        0 1px 2px rgba(0, 0, 0, 0.55),
        0 8px 24px rgba(0, 0, 0, 0.35) !important;
    }`,
);

// Soft dark scrim so titles stay readable over dense art
if (!html.includes('data-chalh-axis-cover-scrim')) {
  html = html.replace(
    `.front-cover {
      background-image: var(--cover) !important;
      background-color: var(--cover-color) !important;
      background-size: cover !important;
      background-position: center !important;`,
    `.front-cover {
      background-image:
        linear-gradient(180deg, rgba(12,14,16,.42) 0%, rgba(12,14,16,.12) 38%, rgba(12,14,16,.48) 100%),
        var(--cover) !important;
      background-color: var(--cover-color) !important;
      background-size: cover !important;
      background-position: center !important;
      /* data-chalh-axis-cover-scrim */`,
  );
}

fs.writeFileSync(path, html);

const check = fs.readFileSync(path, 'utf8');
console.log({
  projets: check.includes("cover-projets.jpg"),
  gouvernance: check.includes("cover-gouvernance.jpg"),
  partenaires: check.includes("cover-partenaires.jpg"),
  dataUrlLeft: check.includes("--cover: url('data:image"),
  lightInk: check.includes('--cover-ink: #f2efe8'),
  motionHidden: /cover-motion \{\s*display:\s*none\s*!important;/.test(check),
  sizeMB: (check.length / 1024 / 1024).toFixed(2),
});

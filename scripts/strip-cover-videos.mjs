import fs from 'fs';

const path = 'public/landing-pages/bestsellers-book-showcase.html';
let html = fs.readFileSync(path, 'utf8');
const before = html.length;

// Drop embedded mp4 payloads (covers are static JPGs now)
html = html.replace(
  /<video class="cover-motion"[\s\S]*?<\/video>/g,
  '<!-- cover-motion removed for performance -->',
);

fs.writeFileSync(path, html);
console.log({
  beforeMB: (before / 1e6).toFixed(2),
  afterMB: (html.length / 1e6).toFixed(2),
  videosLeft: (html.match(/data:video\/mp4/g) || []).length,
});

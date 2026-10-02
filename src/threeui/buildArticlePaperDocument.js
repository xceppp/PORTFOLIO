/**
 * Patch the exact ThreeUI 3d-paper.html document with one publication + theme.
 * Keeps shaders/motion intact; only swaps editorial copy and stage chrome colors.
 */

function esc(str) {
  return JSON.stringify(String(str ?? ''));
}

function clip(str, max) {
  const s = String(str ?? '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}

function authorLines(authors) {
  if (!authors) return ['Zakaria CHALH', 'EST de Meknès', 'Production scientifique'];
  const cleaned = authors.replace(/^avec\s+/i, '');
  const parts = cleaned
    .split(/\s+et\s+|,\s*/)
    .map((p) => p.trim())
    .filter(Boolean);
  const lines = ['Zakaria CHALH', ...parts].slice(0, 3);
  while (lines.length < 3) lines.push('');
  return lines;
}

/** Prefer word-aware wrap for certificate headlines (canvas has no CSS wrap). */
function wrapLines(str, maxChars, maxLines) {
  const words = String(str ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  if (!words.length) return [''];
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (next.length > maxChars && cur) {
      lines.push(cur);
      cur = w;
      if (lines.length >= maxLines) break;
    } else {
      cur = next;
    }
  }
  if (lines.length < maxLines && cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = clip(kept[maxLines - 1], maxChars);
    return kept;
  }
  if (lines[lines.length - 1] && lines[lines.length - 1].length > maxChars) {
    lines[lines.length - 1] = clip(lines[lines.length - 1], maxChars);
  }
  return lines;
}

function replaceOnce(html, search, replacement, label) {
  if (!html.includes(search)) {
    console.warn(`[paper-patch] miss: ${label}`);
    return html;
  }
  return html.replace(search, replacement);
}

export function buildArticlePaperDocument(baseHtml, article, theme = 'dark') {
  // Source ships with CRLF — normalize so every patch matches
  let html = String(baseHtml).replace(/\r\n/g, '\n');

  const year = String(article.year || '');
  const journal = String(article.journal || 'Publication').replace(/\s+/g, ' ').trim();
  const title = String(article.title || '').replace(/\s+/g, ' ').trim();
  const journalLines = wrapLines(journal, 30, 2);
  const titleLines = wrapLines(title, 28, 4);
  const lines = authorLines(article.authors);
  const wordmark = year || 'PAPER';
  const titleBlockH = titleLines.length * 58;
  const authorsY = Math.min(820, 500 + titleBlockH + 36);
  const darkTheme = theme !== 'light';

  html = replaceOnce(html, '<h1>NOCTURNE</h1>', `<h1>${wordmark}</h1>`, 'wordmark');
  html = replaceOnce(
    html,
    'color:rgba(242,242,240,.125);',
    darkTheme ? 'color:rgba(236,236,234,.12);' : 'color:rgba(22,24,27,.06);',
    'wordmark-color',
  );

  html = replaceOnce(
    html,
    ':root{ --bg:#08080a; --ink:#f2f2f0; --dim:rgba(242,242,240,.38); }',
    darkTheme
      ? ':root{ --bg:transparent; --ink:#ececea; --dim:rgba(236,236,234,.42); color-scheme:dark; }'
      : ':root{ --bg:transparent; --ink:#16181b; --dim:rgba(22,24,27,.48); color-scheme:light; }',
    'root-vars',
  );

  html = replaceOnce(
    html,
    'html,body{height:100%;background:var(--bg);overflow:hidden;',
    'html,body{height:100%;background:transparent!important;background-color:transparent!important;overflow:hidden;',
    'html-body-bg',
  );

  // Kill every host plate / vignette / grain that can read as a white square
  html = replaceOnce(
    html,
    '</style>',
    `/* chalh-paper-float-v9 */
  html,body,#bg,#gl,canvas,#hint{background:transparent!important;background-color:transparent!important}
  #bg,#dof,#vig,#grain,#grain2{display:none!important;visibility:hidden!important;opacity:0!important;width:0!important;height:0!important;pointer-events:none!important}
  #hint{color:${darkTheme ? 'rgba(236,236,234,.38)' : 'rgba(22,24,27,.45)'}!important}
  #hint b{color:${darkTheme ? 'rgba(236,236,234,.62)' : 'rgba(22,24,27,.72)'}!important}
</style>`,
    'float-css',
  );

  // Remove #bg node entirely so nothing paints a plate
  html = html.replace(/<div id="bg">[\s\S]*?<\/div>/, '<!-- chalh: no bg plate -->');

  html = replaceOnce(
    html,
    'halo.position.z = -0.62; group.add(halo);',
    'halo.position.z = -0.62; halo.visible = false; /* chalh: no halo plate */',
    'halo-add',
  );
  html = replaceOnce(
    html,
    'halo.material.opacity = intro*0.30;',
    'halo.material.opacity = 0; halo.visible = false;',
    'halo-opacity',
  );

  html = replaceOnce(
    html,
    "const renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:true,\n                                      powerPreference:'high-performance'});",
    `const renderer = new T.WebGLRenderer({canvas, antialias:true, alpha:true, premultipliedAlpha:false,
                                      powerPreference:'high-performance'});
renderer.setClearColor(0x000000, 0);
canvas.style.background='transparent';`,
    'renderer',
  );

  if (darkTheme) {
    // Soft key so the white sheet stays bright against the dark stage
    html = replaceOnce(
      html,
      'const key  = new T.DirectionalLight(0xfff6ec, 1.42); key.position.set(-3.3,2.1,2.0);\nconst fill = new T.DirectionalLight(0x9fb6ff, 0.13); fill.position.set(3.6,-1.8,1.6);\nconst rim  = new T.DirectionalLight(0xffffff, 0.10); rim.position.set(1.6,1.2,-2.6);\nscene.add(key,fill,rim,new T.AmbientLight(0xffffff,0.16));',
      'const key  = new T.DirectionalLight(0xfff8f0, 1.35); key.position.set(-3.3,2.1,2.0);\nconst fill = new T.DirectionalLight(0xc5d0e4, 0.22); fill.position.set(3.6,-1.8,1.6);\nconst rim  = new T.DirectionalLight(0xffffff, 0.16); rim.position.set(1.6,1.2,-2.6);\nscene.add(key,fill,rim,new T.AmbientLight(0xffffff,0.28));',
      'lights',
    );
  }

  // Strip certificate square frame strokes
  html = replaceOnce(
    html,
    `  ctx.strokeStyle='rgba(255,255,255,.34)'; ctx.lineWidth=2;
  rr(ctx,20,20,1160,1616,14); ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.12)'; ctx.lineWidth=1;
  rr(ctx,36,36,1128,1584,10); ctx.stroke();`,
    '  /* chalh: no square frame strokes */',
    'frame-strokes',
  );

  // Material — white floating sheet in both themes (dark mode keeps dark stage)
  html = replaceOnce(
    html,
    `map: tex, color: new T.Color(0xc4d2e8), side: T.DoubleSide, metalness: 0.0,
  roughness: 0.06, clearcoat: 1.0, clearcoatRoughness: 0.03,
  iridescence: 0.10, iridescenceIOR: 1.35, iridescenceThicknessRange:[120,420],
  envMapIntensity: 1.15, specularIntensity: 1.0, ior: 1.5,
  transparent: true, alphaTest: 0.012, opacity: 1`,
    darkTheme
      ? `map: tex, color: new T.Color(0xf4f5f3), side: T.DoubleSide, metalness: 0.0,
  roughness: 0.12, clearcoat: 0.55, clearcoatRoughness: 0.08,
  iridescence: 0.04, iridescenceIOR: 1.35, iridescenceThicknessRange:[120,360],
  envMapIntensity: 0.75, specularIntensity: 0.7, ior: 1.45,
  transparent: true, alphaTest: 0.012, opacity: 0.98`
      : `map: tex, color: new T.Color(0xe8eef6), side: T.DoubleSide, metalness: 0.0,
  roughness: 0.08, clearcoat: 0.85, clearcoatRoughness: 0.04,
  iridescence: 0.06, iridescenceIOR: 1.35, iridescenceThicknessRange:[120,420],
  envMapIntensity: 0.9, specularIntensity: 0.85, ior: 1.45,
  transparent: true, alphaTest: 0.012, opacity: 0.92`,
    'material',
  );

  html = replaceOnce(
    html,
    "ctx.fillStyle='rgba(255,255,255,.030)'; ctx.fillRect(0,0,1200,1656);",
    darkTheme
      ? "ctx.fillStyle='#f7f7f5'; ctx.fillRect(0,0,1200,1656);"
      : "ctx.fillStyle='rgba(248,249,250,.22)'; ctx.fillRect(0,0,1200,1656);",
    'glass-fill',
  );

  html = replaceOnce(
    html,
    "fr.addColorStop(0,'rgba(255,255,255,0)');   fr.addColorStop(.26,'rgba(255,255,255,.060)');\n  fr.addColorStop(.74,'rgba(255,255,255,.060)'); fr.addColorStop(1,'rgba(255,255,255,0)');",
    darkTheme
      ? "fr.addColorStop(0,'rgba(255,255,255,0)');   fr.addColorStop(.22,'rgba(255,255,255,.55)');\n  fr.addColorStop(.78,'rgba(255,255,255,.55)'); fr.addColorStop(1,'rgba(255,255,255,0)');"
      : "fr.addColorStop(0,'rgba(244,245,243,0)');   fr.addColorStop(.22,'rgba(244,245,243,.16)');\n  fr.addColorStop(.78,'rgba(244,245,243,.16)'); fr.addColorStop(1,'rgba(244,245,243,0)');",
    'frost',
  );

  // Dark ink on white paper — both themes
  const ink = "'#0f1113'";
  const ink78 = "'rgba(15,17,19,.78)'";
  const ink62 = "'rgba(15,17,19,.62)'";
  const ink92 = "'rgba(15,17,19,.92)'";
  const editorial = [
    `  ctx.fillStyle=${ink}; ctx.font='700 88px "Inter Tight", Inter, sans-serif';`,
    `  ctx.fillText(${esc(`${year || '·'}.`)}, M, 168);`,
    ``,
    `  ctx.font='600 46px "Inter Tight", Inter, sans-serif';`,
    `  ctx.fillStyle=${ink78};`,
    `  ${JSON.stringify(journalLines)}.forEach((s,i)=>ctx.fillText(s, M, 286+i*54));`,
    `  ctx.font='500 38px "Inter Tight", Inter, sans-serif';`,
    `  ctx.fillStyle=${ink62};`,
    `  ctx.fillText(${esc(year)}, M, 286+${journalLines.length}*54+16);`,
    `  ctx.font='600 50px "Inter Tight", Inter, sans-serif'; ctx.fillStyle=${ink};`,
    `  ${JSON.stringify(titleLines)}.forEach((s,i)=>ctx.fillText(s, M, 430+i*58));`,
    ``,
    `  ctx.font='600 30px Inter, sans-serif'; ctx.fillStyle=${ink92};`,
    `  ${JSON.stringify(lines)}.forEach((s,i)=>{ if(!s) return; ctx.fillText(s, M+4, ${authorsY}+i*40); });`,
  ].join('\n');

  html = replaceOnce(
    html,
    `  ctx.fillStyle='#ffffff'; ctx.font='700 104px "Inter Tight", Inter, sans-serif';
  ctx.fillText('o.', M, 190);

  ctx.font='500 106px "Inter Tight", Inter, sans-serif';
  ctx.fillStyle='rgba(255,255,255,.52)';
  ctx.fillText('Studio of the Week.', M, 392);
  ctx.fillText('Feb 14, 2026',        M, 518);
  ctx.font='600 110px "Inter Tight", Inter, sans-serif'; ctx.fillStyle='#ffffff';
  ctx.fillText('Nocturne Studio.', M, 664);

  ctx.font='600 34px Inter, sans-serif'; ctx.fillStyle='rgba(255,255,255,.90)';
  ['By Nocturne Studio','Ilya Marchetti','Dara Okonkwo'].forEach((s,i)=>
    ctx.fillText(s, M+4, 752+i*45));`,
    editorial,
    'editorial',
  );

  html = replaceOnce(
    html,
    "ctx.fillText('2026 Official Certificate.', px, py);",
    `ctx.fillText(${esc(`Publication · ${year}`)}, px, py);`,
    'cert-label',
  );
  html = replaceOnce(
    html,
    "const endY = wrapL(ctx,'The orbit jury is proud to declare this website Studio of the Week in recognition of the great talent and effort invested in its creation.',px,py+36,296,28);",
    `const endY = wrapL(ctx,${esc(title)},px,py+36,296,26);`,
    'cert-body',
  );
  html = replaceOnce(html, "ctx.fillText('SOTW', 48, 0);", `ctx.fillText(${esc('DOI')}, 48, 0);`, 'sotw');
  html = replaceOnce(html, "ctx.fillText('orbit.', M, 1516);", `ctx.fillText(${esc('orcid.')}, M, 1516);`, 'orbit');
  html = replaceOnce(
    html,
    "ctx.measureText('orbit.').width",
    `ctx.measureText(${esc('orcid.')}).width`,
    'orbit-w',
  );
  html = replaceOnce(
    html,
    "ctx.fillText(' winners', M+w, 1516);",
    `ctx.fillText(${esc(' works')}, M+w, 1516);`,
    'winners',
  );

  // Remaining paints — dark ink on white sheet (both themes)
  {
    const paintStart = html.indexOf('function drawGlass(ctx){');
    const paintEnd = html.indexOf('function makeCertTexture()', paintStart);
    if (paintStart !== -1 && paintEnd !== -1) {
      let paint = html.slice(paintStart, paintEnd);
      paint = paint.replaceAll("fillStyle='#ffffff'", "fillStyle='#0f1113'");
      paint = paint.replaceAll('rgba(255,255,255,.52)', 'rgba(15,17,19,.70)');
      paint = paint.replaceAll('rgba(255,255,255,.90)', 'rgba(15,17,19,.92)');
      paint = paint.replaceAll('rgba(255,255,255,.92)', 'rgba(15,17,19,.94)');
      paint = paint.replaceAll('rgba(255,255,255,.68)', 'rgba(15,17,19,.72)');
      paint = paint.replaceAll('rgba(255,255,255,.62)', 'rgba(15,17,19,.66)');
      paint = paint.replaceAll("strokeStyle='rgba(255,255,255,.34)'", "strokeStyle='rgba(15,17,19,.40)'");
      paint = paint.replaceAll("strokeStyle='rgba(255,255,255,.12)'", "strokeStyle='rgba(15,17,19,.18)'");
      html = html.slice(0, paintStart) + paint + html.slice(paintEnd);
    }
  }

  const early = `
<script data-chalh-paper-shim>
(function () {
  try { void window.localStorage; } catch (err) {
    var mem = {};
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
        setItem: function (k, v) { mem[k] = String(v); },
        removeItem: function (k) { delete mem[k]; },
        clear: function () { mem = {}; },
      },
    });
  }
})();
<\/script>`;
  const bridge = `
<script data-chalh-paper-bridge>
(function () {
  var doi = ${esc(article.doi || '')};
  var down = null;
  window.addEventListener('pointerdown', function (e) {
    down = { x: e.clientX, y: e.clientY, t: Date.now() };
  }, true);
  window.addEventListener('pointerup', function (e) {
    if (!down || !doi) return;
    var dx = e.clientX - down.x, dy = e.clientY - down.y;
    var dt = Date.now() - down.t;
    down = null;
    if (dt < 320 && dx * dx + dy * dy < 36) {
      parent.postMessage({ type: 'chalh-paper-open', doi: doi }, '*');
    }
  }, true);
})();
<\/script>`;

  if (!html.includes('data-chalh-paper-shim')) {
    html = html.replace('<meta charset="utf-8">', `<meta charset="utf-8">${early}`);
    if (!html.includes('data-chalh-paper-shim')) html = early + html;
  }
  if (!html.includes('data-chalh-paper-bridge')) {
    html = html.includes('</body>') ? html.replace('</body>', `${bridge}\n</body>`) : html + bridge;
  }

  return html;
}

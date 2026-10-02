import fs from 'fs';
import { buildTrajectoireKoiDocument } from '../src/threeui/buildTrajectoireKoiDocument.js';

const html = fs.readFileSync('./src/threeui/sources/synthralos-halftone.html', 'utf8');
const stations = [
  {
    years: 'x',
    mark: 'x',
    role: 'Role',
    institution: 'Inst',
    place: 'Place',
    detail: 'Detail',
    logo: 'http://127.0.0.1:5180/logos/umi-est.svg',
  },
  {
    years: 'y',
    mark: 'y',
    role: 'Role2',
    institution: 'Inst2',
    place: 'Place2',
    detail: 'Detail2',
    logo: 'http://127.0.0.1:5180/logos/ensa.svg',
  },
  {
    years: 'z',
    mark: 'z',
    role: 'Role3',
    institution: 'Inst3',
    place: 'Place3',
    detail: 'Detail3',
    logo: 'http://127.0.0.1:5180/logos/psa.svg',
  },
];

const out = buildTrajectoireKoiDocument(html, stations, 'dark');
const checks = {
  skipShader: out.includes('skip CDN shader'),
  drawLogo: out.includes('trajectoireDrawLogo'),
  openMsg: out.includes('type: "open"'),
  stations: out.includes('TRAJECTOIRE_STATIONS'),
  logoUrl: out.includes('umi-est.svg'),
  hint: out.includes('glisser'),
  mountCall: /mountFluidPastels\(\);/.test(out),
  animateOff: out.includes('if (typeof TRAJECTOIRE_STATIONS !== "undefined") return false'),
  drawEarly: out.includes('if (typeof TRAJECTOIRE_STATIONS !== "undefined") {\n          trajectoireDrawLogo(card);\n          return;'),
  maskSkip: out.includes('drawMaskedFrame') && out.includes('trajectoireDrawLogo(card);\n          return;\n        }\n\n        drawMediaAndGrid(card)'),
};
console.log(JSON.stringify(checks, null, 2));
if (!checks.skipShader || !checks.drawLogo || !checks.openMsg || checks.mountCall || !checks.maskSkip) {
  process.exit(1);
}

import fs from 'fs';
import { createRequire } from 'module';
import opentype from '../scribeocr/lib/opentype.module.js';
import canvasKitInit from 'canvaskit-wasm';

import { fontPaths } from './localPaths.js';

const canvasKit = await canvasKitInit();

globalThis.self = globalThis;
globalThis.require = createRequire(import.meta.url);
const { fileURLToPath } = await import('url');
const { dirname } = await import('path');
globalThis.__dirname = dirname(fileURLToPath(import.meta.url));


const fontCompAll = {
  Arial: {
    normal: {
      comp1: [fontPaths.Arial],
    },
    type: 'sans',
  },
  Baskerville: {
    normal: {
      comp1: [fontPaths.Baskerville],
    },
    type: 'sans',
  },
  Bookman: {
    normal: {
      comp1: [fontPaths.Bookman],
    },
    type: 'serif',
  },
  Calibri: {
    normal: {
      comp1: [fontPaths.Calibri],
    },
    type: 'sans',
  },
  Century: {
    normal: {
      comp1: [fontPaths.Century],
    },
    type: 'serif',
  },
  Courier: {
    normal: {
      comp1: [fontPaths.Courier],
    },
    type: 'serif',
  },
  Garamond: {
    normal: {
      comp1: [fontPaths.Garamond],
    },
    type: 'serif',
  },
  Georgia: {
    normal: {
      comp1: [fontPaths.Georgia],
    },
    type: 'serif',
  },
  Helvetica: {
    normal: {
      comp1: [fontPaths.Helvetica],
    },
    type: 'sans',
  },
  Minion: {
    normal: {
      comp1: [fontPaths["Old English"]],
    },
    type: 'sans',
  },
  'Old English': {
    normal: {
      comp1: [fontPaths["Old English"]],
    },
    type: 'serif',
  },
  Palatino: {
    normal: {
      comp1: [fontPaths.Palatino],
    },
    type: 'serif',
  },
  'Times New Roman': {
    normal: {
      comp1: [fontPaths["Times New Roman"]],
    },
    type: 'serif',
  },
  Veranda: {
    normal: {
      comp1: [fontPaths.Veranda],
    },
    type: 'sans',
  },
};

const inputArr1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const inputArr2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const inputArr3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const inputArr = [inputArr1, inputArr2, inputArr3];
const inputArrFlat = [...inputArr1, ...inputArr2, ...inputArr3];

// All fonts must be registered before the canvas is created, so all raw and optimized fonts are loaded.
// Even when using optimized fonts, at least one raw font is needed to compare against optimized version.

const dummyCanvas = await canvasKit.MakeCanvas(1, 1);

const fontFaceNameArr = [];
const fontOpentypeArr = [];
for (const [key1, value1] of Object.entries(fontCompAll)) {
  const fontPath = `${__dirname}/${value1.normal.comp1[0]}`;
  const fontObj1a = await opentype.load(fontPath);
  fontOpentypeArr.push(fontObj1a);
  const fontData = fs.readFileSync(fontPath);
  await dummyCanvas.loadFont(fontData, { family: key1, style: 'normal' });
  fontFaceNameArr.push(key1);
}

const fontSize = 80;

for (let i = 0; i < fontFaceNameArr.length; i++) {
  const fontObj = fontOpentypeArr[i];
  const fontFaceName = fontFaceNameArr[i];

  for (const char of inputArrFlat) {
    const metrics = fontObj.charToGlyph(char).getMetrics();

    const widthPx = (metrics.xMax - metrics.xMin) * (fontSize / fontObj.unitsPerEm);
    const heightPx = (metrics.yMax - metrics.yMin) * (fontSize / fontObj.unitsPerEm);

    const topPx = metrics.yMax * (fontSize / fontObj.unitsPerEm);

    const leftSideBearingPx = metrics.xMin * (fontSize / fontObj.unitsPerEm);

    const canvas = await canvasKit.MakeCanvas(Math.round(widthPx), Math.round(heightPx));

    const ctx = /** @type {OffscreenCanvasRenderingContext2D} */ (/** @type {unknown} */ (canvas.getContext('2d')));

    ctx.fillStyle = 'black';
    ctx.font = `${String(fontSize)}px ${fontFaceName}`;

    ctx.fillText(char, -leftSideBearingPx, topPx);

    const canvasDataURL = canvas.toDataURL('image/png');
    const imgData = new Uint8Array(atob(canvasDataURL.split(',')[1])
        .split('')
        .map((c) => c.charCodeAt(0)));


    fs.writeFileSync(`${__dirname}/../char_img/${fontFaceName}_${char}.png`, imgData);

  }

}

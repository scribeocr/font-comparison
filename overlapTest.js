
import opentype from './scribeocr/lib/opentype.module.js';

import { optimizeFont } from './scribeocr/js/worker/optimizeFontModule.js';

import { FontMetricsFont } from './scribeocr/js/objects/fontMetricsObjects.js';

import { saveAs } from './scribeocr/js/miscUtils.js';

import { loadImageElem } from './scribeocr/js/imageUtils.js';

const fontCompAll = {
  Arial: {
    normal: {
      comp2: ['/fonts/ua1r8a.woff'],
    },
    type: 'sans',
  },
  Baskerville: {
    normal: {
      comp2: ['/fonts/LibreBaskerville-Regular.ttf', '/fonts/QTBasker.otf'],
    },
    type: 'serif',
  },
  Bookman: {
    normal: {
      comp2: ['/fonts/URWBookman-Light.ttf'],
    },
    type: 'serif',
  },
  Calibri: {
    normal: {
      comp2: ['/fonts/Carlito-Regular.ttf'],
    },
    type: 'sans',
  },
  Century: {
    normal: {
      comp2: ['/fonts/C059-Roman.ttf'],
    },
    type: 'serif',
  },
  Courier: {
    normal: {
      comp2: ['/fonts/NimbusMono-Regular.ttf'],
    },
    type: 'serif',
  },
  Garamond: {
    normal: {
      comp2: ['/fonts/Garamond-Antiqua.ttf', '/fonts/EBGaramond-Regular.ttf', '/fonts/QTGaromand.otf', '/fonts/CrimsonText-Regular.ttf', '/fonts/CrimsonPro-Regular.ttf'],
    },
    type: 'serif',
  },
  Helvetica: {
    normal: {
      comp2: ['/fonts/NimbusSans-Regular.ttf'],
    },
    type: 'sans',
  },
  Minion: {
    normal: {
      comp2: ['/fonts/CrimsonText-Regular.ttf'],
    },
    type: 'serif',
  },
  'Old English': {
    normal: {
      comp2: ['/fonts/Canterbury.ttf'],
    },
    type: 'serif',
  },
  Palatino: {
    normal: {
      comp2: ['/fonts/P052-Roman.ttf'],
    },
    type: 'serif',
  },
  'Times New Roman': {
    normal: {
      comp2: ['/fonts/NimbusRoman-Regular.ttf'],
    },
    type: 'serif',
  },
  Veranda: {
    normal: {
      comp2: ['/fonts/tahoma.ttf'],
    },
    type: 'sans',
  },
};

const inputArr1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const inputArr2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const inputArr3 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const inputArr = [inputArr1, inputArr2, inputArr3];
const inputArrFlat = [...inputArr1, ...inputArr2, ...inputArr3];

// Prevent typescript intellisense errors
// https://stackoverflow.com/questions/35758584/cannot-redeclare-block-scoped-variable
export {};

const fontSize = 80;
const baselineArr = [100, 200, 300];

const compFontElem = /** @type {HTMLSelectElement} */(document.getElementById('compFont'));
const compStyleElem = /** @type {HTMLSelectElement} */(document.getElementById('compStyle'));

const downloadFontElem = /** @type {HTMLSelectElement} */(document.getElementById('downloadFont'));

const compFontBtnElem = /** @type {HTMLButtonElement} */(document.getElementById('compFontBtn'));
const downloadFontBtnElem = /** @type {HTMLButtonElement} */(document.getElementById('downloadFontBtn'));

const compAllElem = /** @type {HTMLInputElement} */(document.getElementById('compAll'));

const optimizeCheckElem = /** @type {HTMLInputElement} */(document.getElementById('optimizeCheck'));

/**
 *
 * @param {HTMLSelectElement} selectElem
 * @param {string} value
 */
const addOption = (selectElem, value) => {
  const option = document.createElement('option');
  option.text = value;
  option.value = value;
  selectElem.add(option);
};

for (const [key, value] of Object.entries(fontCompAll)) {
  addOption(compFontElem, key);
}

const optionNormalElem = /** @type {HTMLOptionElement} */(document.getElementById('optionNormal'));
const optionItalicElem = /** @type {HTMLOptionElement} */(document.getElementById('optionItalic'));

compFontElem.addEventListener('change', () => {
  const font = compFontElem.value;
  if (!fontCompAll[font].italic) {
    compStyleElem.value = 'normal';
    optionItalicElem.disabled = true;
  } else {
    optionItalicElem.disabled = false;
  }
});

compFontBtnElem.addEventListener('click', () => main());

/** @type {?ArrayBuffer} */
// globalThis.fontDataComb = null;

downloadFontBtnElem.addEventListener('click', () => {
  if (!fontData[downloadFontElem.value]) return;

  const fontBlob = new Blob([fontData[downloadFontElem.value]]);
  saveAs(fontBlob, 'font.woff');
});


const metricsFromCharImg = (fontFaceName) => {
  const fontMetrics1 = new FontMetricsFont();

  const AHeight1 = charImgObj[fontFaceName].A.height;

  const xHeight1 = charImgObj[fontFaceName].o.height;

  for (let i = 0; i < inputArrFlat.length; i++) {
    const char = inputArrFlat[i];
    const charUnicode = String(char.charCodeAt(0));

    fontMetrics1.width[charUnicode] = charImgObj[fontFaceName][char].width / xHeight1;
    fontMetrics1.height[charUnicode] = charImgObj[fontFaceName][char].height / xHeight1;

    fontMetrics1.heightCaps = AHeight1 / xHeight1;
  }

  return fontMetrics1;
};

const charImgPromises = {};
const charImgObj = {};
async function charImgImg(fontFaceName) {
  if (charImgPromises[fontFaceName]) return charImgPromises[fontFaceName];

  let resolve_;
  charImgPromises[fontFaceName] = new Promise((resolve) => {
    resolve_ = resolve;
  });

  charImgObj[fontFaceName] = {};
  await Promise.all(inputArrFlat.map(async (char) => {
    const imgPath = `/char_img/${fontFaceName}_${char}.png`;
    const imgElem = new Image();
    await loadImageElem(imgPath, imgElem);
    charImgObj[fontFaceName][char] = imgElem;
  }));

  resolve_();
}

async function loadOptimizeFonts(fontFaceName1, fontStyle2, src2) {
  await charImgImg(fontFaceName1);

  const fontMetrics1 = metricsFromCharImg(fontFaceName1);
  
  const fontOptObj2 = await optimizeFont({
    fontData: src2,
    fontMetricsObj: fontMetrics1,
    style: fontStyle2,
    adjustAllLeftBearings: true,
    standardizeSize: true,
    // targetEmSize,
    transGlyphs: optimizeCheckElem.checked,
  });


  const fontDataOpt2 = fontOptObj2.fontData;

  const fontObj2a = await opentype.parse(fontDataOpt2);

  const fontFamily2 = fontObj2a.names.fontFamily.en;

  const newFont2 = new FontFace(fontFamily2, fontDataOpt2, { style: fontStyle2 });

  await newFont2.load();
  // add font to document
  document.fonts.add(newFont2);

  // enable font with CSS class
  document.body.classList.add('fonts-loaded');

  return {
    font1: null, font2: fontObj2a, fontData1: null, fontData2: fontDataOpt2,
  };
}

/**
 * Creates a canvas element, sets its dimensions and style, and appends it to the document body.
 *
 * @param {number} width - The width of the canvas in pixels.
 * @param {number} height - The height of the canvas in pixels.
 */
const createCanvas = (width, height, invis = false) => {
  const canvas = document.createElement('canvas');

  // Set canvas properties (optional)
  canvas.id = 'myCanvas';
  canvas.width = width;
  canvas.height = height;
  canvas.style.border = '1px solid';
  if (invis) canvas.style.display = 'none';

  // Add the canvas to the document's body
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('2d rendering context does not exist');

  return ctx;
};

const fontData = {};

const loadEvalFonts = async (fontFaceName1, font2, combined = false) => {
  const fontRes = await loadOptimizeFonts(fontFaceName1, 'normal', font2);
  //   const fontObj1 = fontRes.font1;
  const fontObj2 = fontRes.font2;
  //   const fontFamily1 = fontObj1.names.fontFamily.en;
  const fontFamily2 = fontObj2.names.fontFamily.en;

  if (!combined) {
    fontData[fontFamily2] = fontRes.fontData2;
    addOption(downloadFontElem, fontObj2.names.fontFamily.en);
  } else {
    addOption(downloadFontElem, 'Combined');
  }

  const testRes = test(fontFaceName1, fontFamily2, fontObj2);
  return {
    font2: fontObj2,
    metrics: testRes.metrics,
    coords: testRes.coords,
    ctx: testRes.ctx,
  };
};

/**
 * Function that transforms a single numeric input.
 * @callback transformFunc
 * @param {number} x - Numeric input
 */

/**
 * Apply function to all points on glyph.
 * @param {opentype.Glyph} glyph
 * @param {transformFunc} func
 * @param {boolean} transX - Transform x coordinates
 * @param {boolean} transY - Transform y coordinates
 */
function transformGlyph(glyph, func, transX = false, transY = false) {
  for (let j = 0; j < glyph.path.commands.length; j++) {
    const pointJ = glyph.path.commands[j];

    if (pointJ.type === 'M' || pointJ.type === 'L' || pointJ.type === 'C' || pointJ.type === 'Q') {
      if (transX) pointJ.x = func(pointJ.x);
      if (transY) pointJ.y = func(pointJ.y);
      if (pointJ.type === 'C' || pointJ.type === 'Q') {
        if (transX) pointJ.x1 = func(pointJ.x1);
        if (transY) pointJ.y1 = func(pointJ.y1);
        if (pointJ.type === 'C') {
          if (transX) pointJ.x2 = func(pointJ.x2);
          if (transY) pointJ.y2 = func(pointJ.y2);
        }
      }
    }
  }
}

const main = async () => {
  const fontComp = fontCompAll[compFontElem.value][compStyleElem.value];

  let comp2 = fontComp.comp2;

  // If the `compAll` checkbox is selected, fonts are compared to all other fonts of same type (sans/serif).
  if (compAllElem.checked) {
    comp2 = [];
    for (const [key, value] of Object.entries(fontCompAll)) {
      if (value.type === fontCompAll[compFontElem.value].type) {
        comp2.push(...(value[compStyleElem.value].comp2.filter((x) => !comp2.includes(x))));
      }
    }
  }

  const resArr1 = [];
  for (let i = 0; i < comp2.length; i++) {
    resArr1.push(loadEvalFonts(compFontElem.value, comp2[i]));
  }

  const resArr = await Promise.all(resArr1);

  // If multiple alternative fonts are being compared, create a combined version.
  if (resArr.length > 1) {
    const font2a = resArr[0].font2;

    for (let i = 0; i < inputArrFlat.length; i++) {
      const char = inputArrFlat[i];

      let bestComp = 0;
      for (let j = 1; j < resArr.length; j++) {
        if (resArr[j].metrics[i] < resArr[bestComp].metrics[i]) {
          bestComp = j;
        }
      }

      if (bestComp > 0) {
        const font2b = resArr[bestComp].font2;

        const glyph2a = font2a.charToGlyph(char);

        const glyph2b = font2b.charToGlyph(char);

        glyph2a.path = glyph2b.path;

        if (font2a.unitsPerEm !== resArr[bestComp].font2.unitsPerEm) {
          transformGlyph(glyph2a, (x) => x * (font2a.unitsPerEm / resArr[bestComp].font2.unitsPerEm), true, true);
        }
      }

      const bestCtx = resArr[bestComp].ctx;
      const coords = resArr[bestComp].coords[i];
      bestCtx.fillStyle = 'rgba(0, 1, 0, 0.1)';
      bestCtx.fillRect(coords[0] - 10, coords[1] - fontSize + (fontSize / 5), fontSize, fontSize);
    }

    fontData.Combined = font2a.toArrayBuffer();

    await loadEvalFonts(compFontElem.value, fontData.Combined, true);
  }
};

const imageBlackToRed = (img) => {
  const canvas = document.createElement('canvas');
  const ctx = /** @type {CanvasRenderingContext2D} */ (canvas.getContext('2d'));

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] === 0) {
      data[i] = 255;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return ctx;
};

/**
 *
 * @param {string} fontName1
 * @param {string} fontName2
 * @param {opentype.Font} fontObj2
 * @returns
 */
const test = (fontName1, fontName2, fontObj2) => {
  const ctxBase = createCanvas(2200, 400);
  const ctxEval = createCanvas(100, 100, true);

  ctxBase.fillStyle = 'white';
  ctxBase.fillRect(0, 0, ctxBase.canvas.width, ctxBase.canvas.height);

  ctxBase.fillStyle = 'black';
  ctxBase.font = `${String(24)}px Sans`;
  ctxBase.fillText(`Red: ${fontName1}`, 50, baselineArr[2] + 60);
  ctxBase.fillText(`Blue: ${fontName2}`, 50, baselineArr[2] + 85);

  const metricArr = [];
  const coordArr = [];

  const oHeight1 = charImgObj[fontName1].o.height;
  const oMetrics = fontObj2.charToGlyph('o').getMetrics();
  const oHeight2 = (oMetrics.yMax - oMetrics.yMin) * (fontSize / fontObj2.unitsPerEm);

  const fontSize2 = 80 * (oHeight1 / oHeight2);

  for (let i = 0; i < inputArr.length; i++) {
    for (let j = 0; j < inputArr[i].length; j++) {
      const text = inputArr[i][j];
      const left = 10 + j * fontSize;

      const top = baselineArr[i];

      coordArr.push([left, top]);

      const baseImage = charImgObj[fontName1][text];

      const redCtx = imageBlackToRed(baseImage);

      ctxBase.drawImage(redCtx.canvas, left, top - baseImage.height);

      ctxBase.font = `${String(fontSize2)}px ${fontName2}`;
      ctxBase.fillStyle = 'rgba(0, 0, 250, 0.5)';

      const charMetrics = fontObj2.charToGlyph(text).getMetrics();
      const leftBearingPx = charMetrics.leftSideBearing * (fontSize2 / fontObj2.unitsPerEm);
      const descPx = charMetrics.yMin * (fontSize2 / fontObj2.unitsPerEm);

      ctxBase.fillText(text, left - leftBearingPx, top + descPx);

      ctxEval.clearRect(0, 0, ctxEval.canvas.width, ctxEval.canvas.height);
      ctxEval.fillStyle = 'white';
      ctxEval.fillRect(0, 0, ctxEval.canvas.width, ctxEval.canvas.height);

      ctxEval.drawImage(baseImage, 0, 70 - baseImage.height);
      const imageData1 = ctxEval.getImageData(0, 0, ctxEval.canvas.width, ctxEval.canvas.height).data;


      ctxEval.clearRect(0, 0, ctxEval.canvas.width, ctxEval.canvas.height);
      ctxEval.fillStyle = 'white';
      ctxEval.fillRect(0, 0, ctxEval.canvas.width, ctxEval.canvas.height);
      ctxEval.fillStyle = 'black';
      ctxEval.font = `${String(fontSize2)}px ${fontName2}`;
      ctxEval.fillText(text, 0 - leftBearingPx, 70 + descPx);
      const imageData2 = ctxEval.getImageData(0, 0, ctxEval.canvas.width, ctxEval.canvas.height).data;

      let diffA = 0;
      let totalA = 0;
      for (let i = 0; i < imageData1.length; i++) {
        if (imageData1[i] !== 255 || imageData2[i] !== 255) {
          totalA += 1;
          if (imageData1[i] === 255 || imageData2[i] === 255) {
            diffA += 1;
          }
        }
      }

      const metric = diffA / totalA;

      metricArr.push(metric);

      ctxBase.font = `${String(10)}px Sans`;
      ctxBase.fillStyle = 'rgba(0, 0, 0, 1)';

      ctxBase.fillText(String(Math.round(metric * 1e4) / 1e4), left, top + 25);

      // console.log(`${text}: ${String(metric)}`);
    }
  }

  return {
    metrics: metricArr,
    coords: coordArr,
    ctx: ctxBase,
  };
};

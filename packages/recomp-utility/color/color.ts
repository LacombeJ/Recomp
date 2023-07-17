// https://github.com/mrdoob/three.js/blob/master/src/math/Color.js
// https://www.rapidtables.com/convert/color/rgb-to-hsl.html

import { modulo, clamp } from '../common/math';

import { hue2rgb } from './math';
import { nameToHexMap, hexToNameMap } from './named';

/** Standard hex, returns the 6 hexit code prepended with '#' */
export const hex = (hexString: string): Hex => {
  const hex = parseHex(hexString);
  return '#' + hex.text;
};

export const hsl = (h: number, s: number, l: number): HSL => {
  return { h, s, l };
};

export const hsv = (h: number, s: number, v: number): HSV => {
  return { h, s, v };
};

export const rgb = (r: number, g: number, b: number): RGB => {
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
};

export const rgbText = (r: number, g: number, b: number): RGBText => {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
};

// ----------------------------------------------------------------------------

export const hexToRGB = (hexCode: Hex): RGB => {
  const hex = parseHex(hexCode);
  const r = parseInt(hex.text.substring(0, 2), 16);
  const g = parseInt(hex.text.substring(2, 4), 16);
  const b = parseInt(hex.text.substring(4, 6), 16);
  return rgb(r, g, b);
};

export const rgbToHex = (rgb: RGB): Hex => {
  const color = (rgb.r << 16) | (rgb.g << 8) | (rgb.b << 0);
  const hexString = color.toString(16).padStart(6, '0');
  return hex(hexString);
};

export const rgbToHSL = (rgb: RGB): HSL => {
  const { max, min, maxIndex } = rgbMetrics(rgb);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  let hue = 0;
  let saturation = 0;
  let lightness = (min + max) / 2;

  if (min !== max) {
    const delta = max - min;

    saturation =
      lightness <= 0.5 ? delta / (max + min) : delta / (2 - max - min);

    if (maxIndex === 0) {
      hue = (g - b) / delta + (g < b ? 6 : 0);
    } else if (maxIndex === 1) {
      hue = (b - r) / delta + 2;
    } else if (maxIndex === 2) {
      hue = (r - g) / delta + 4;
    }

    hue /= 6;
  }

  return {
    h: hue,
    s: saturation,
    l: lightness,
  };
};

export const rgbToHSV = (rgb: RGB): HSV => {
  const { max, min, maxIndex } = rgbMetrics(rgb);
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  // Hue calculation
  const delta = max - min;
  let hue = 0;
  if (maxIndex === 0) {
    hue = (g - b) / delta + (g < b ? 6 : 0);
  } else if (maxIndex === 1) {
    hue = (b - r) / delta + 2;
  } else if (maxIndex === 2) {
    hue = (r - g) / delta + 4;
  }
  hue /= 6;

  // Saturation calculation
  let saturation = 0;
  if (max !== 0) {
    saturation = (max - min) / max;
  }

  // Value calculation
  let value = max;

  return {
    h: hue,
    s: saturation,
    v: value,
  };
};

export const hslToRGB = (hsl: HSL): RGB => {
  let r = 0;
  let g = 0;
  let b = 0;

  const h = modulo(hsl.h, 1);
  const s = clamp(hsl.s, 0, 1);
  const l = clamp(hsl.l, 0, 1);

  if (l === 1) {
    r = g = b = 255;
  } else {
    const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    const q = 2 * l - p;

    r = Math.round(255 * hue2rgb(q, p, h + 1 / 3));
    g = Math.round(255 * hue2rgb(q, p, h));
    b = Math.round(255 * hue2rgb(q, p, h - 1 / 3));
  }

  return { r, g, b };
};

/**
 * @param {HSV} hsv
 */
export const hsvToRGB = (hsv: HSV): RGB => {
  let r = 0;
  let g = 0;
  let b = 0;

  const h = modulo(hsv.h, 1);
  const s = clamp(hsv.s, 0, 1);
  const l = clamp(hsv.v, 0, 1);

  if (l === 1) {
    r = g = b = 255;
  } else {
    const p = l <= 0.5 ? l * (1 + s) : l + s - l * s;
    const q = 2 * l - p;

    r = Math.round(255 * hue2rgb(q, p, h + 1 / 3));
    g = Math.round(255 * hue2rgb(q, p, h));
    b = Math.round(255 * hue2rgb(q, p, h - 1 / 3));
  }

  return { r, g, b };
};

export const rgbToRGBText = (rgb: RGB): RGBText => {
  return rgbText(rgb.r, rgb.g, rgb.b);
};

export const rgbTextToRGB = (rgbText: RGBText): RGB => {
  const { rgb } = parseRGBText(rgbText);
  return rgb;
};

/** Returns name of hex color, or a hex string if name cannot be determined */
export const hexToName = (hexCode: Hex): Name => {
  const rgb = hexToRGB(hexCode);
  const hex = rgbToHex(rgb).toLowerCase();
  if (hexToNameMap[hex]) {
    return hexToNameMap[hex];
  }
  return hex;
};

/**
 * Returns hex of named color, or a hex string if hex cannot be determined
 * @param {Hex} hexCode
 */
export const nameToHex = (name: Name): Hex => {
  name = name.toLowerCase();
  if (nameToHexMap[name]) {
    return nameToHexMap[name];
  }
  return '#000000';
};

// https://stackoverflow.com/questions/3942878
export const foregroundFromBackground = (
  background: RGB
): 'white' | 'black' => {
  const { r, g, b } = background;
  // return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'black' : 'white';
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  return L > 0.179 ? 'black' : 'white';
};

// ----------------------------------------------------------------------------

export const convert = (color: any, fromType: Format, toType: Format): any => {
  if (fromType === toType) {
    return color;
  }

  if (fromType === 'Hex' && toType === 'HSL') {
    return rgbToHSL(hexToRGB(color));
  }
  if (fromType === 'Hex' && toType === 'RGB') {
    return hexToRGB(color);
  }
  if (fromType === 'Hex' && toType === 'RGBText') {
    const rgb = hexToRGB(color);
    return rgbToRGBText(rgb);
  }
  if (fromType === 'Hex' && toType === 'Name') {
    return hexToName(color);
  }

  if (fromType === 'HSL' && toType === 'Hex') {
    return rgbToHex(hslToRGB(color));
  }
  if (fromType === 'HSL' && toType === 'RGB') {
    return hslToRGB(color);
  }
  if (fromType === 'HSL' && toType === 'RGBText') {
    const rgb = hslToRGB(color);
    return rgbToRGBText(rgb);
  }
  if (fromType === 'HSL' && toType === 'Name') {
    const hex = rgbToHex(hslToRGB(color));
    return hexToName(hex);
  }

  if (fromType === 'RGB' && toType === 'Hex') {
    return rgbToHex(color);
  }
  if (fromType === 'RGB' && toType === 'HSL') {
    return rgbToHSL(color);
  }
  if (fromType === 'RGB' && toType === 'RGBText') {
    return rgbToRGBText(color);
  }
  if (fromType === 'RGB' && toType === 'Name') {
    const hex = rgbToHex(color);
    return hexToName(hex);
  }

  if (fromType === 'RGBText' && toType === 'Hex') {
    const { rgb } = parseRGBText(color);
    return rgbToHex(rgb);
  }
  if (fromType === 'RGBText' && toType === 'HSL') {
    const { rgb } = parseRGBText(color);
    return rgbToHSL(rgb);
  }
  if (fromType === 'RGBText' && toType === 'RGB') {
    return rgbTextToRGB(color);
  }
  if (fromType === 'RGBText' && toType === 'Name') {
    const hex = rgbToHex(parseRGBText(color).rgb);
    return hexToName(hex);
  }

  if (fromType === 'Name' && toType === 'Hex') {
    return nameToHex(color);
  }
  if (fromType === 'Name' && toType === 'HSL') {
    const hex = nameToHex(color);
    return rgbToHSL(hexToRGB(hex));
  }
  if (fromType === 'Name' && toType === 'RGB') {
    const hex = nameToHex(color);
    return hexToRGB(hex);
  }
  if (fromType === 'Name' && toType === 'RGBText') {
    const hex = nameToHex(color);
    const rgb = hexToRGB(hex);
    return rgbToRGBText(rgb);
  }

  throw new Error(`Conversion from ${fromType} to ${toType} is not supported`);
};

export const convertTo = (color: Color, toType: Format) => {
  const { type } = detail(color);
  return convert(color, type, toType);
};

/** Converts back a color to the same type as the given original color */
export const convertBack = (color: Color, originalColor: Color) => {
  const { type } = detail(color);
  const { type: originalType } = detail(originalColor);
  return convert(color, type, originalType);
};

// ----------------------------------------------------------------------------

const getDetail = (color: string): { type: Format; data: any } => {
  if (isHSL(color)) {
    return { type: 'HSL', data: color };
  }

  if (isRGB(color)) {
    return { type: 'RGB', data: color };
  }

  const hexInfo = parseHexInfo(color);
  if (hexInfo && !hexInfo.error) {
    return { type: 'Hex', data: hexInfo };
  }

  const rgbTextInfo = parseRGBTextInfo(color);
  if (rgbTextInfo && !rgbTextInfo.error) {
    return { type: 'RGBText', data: rgbTextInfo };
  }

  if (typeof color === 'string' && nameToHexMap[color.toLowerCase()]) {
    return { type: 'Name', data: color };
  }
};

export const detail = (color: any) => {
  const result = getDetail(color);

  if (result) {
    return result;
  }

  throw new Error('Could not determine color details');
};

export const isColor = (color: any) => {
  const result = getDetail(color);

  if (result) {
    return true;
  }

  return false;
};

export const parseHex = (hex: Hex) => {
  const res = parseHexInfo(hex);
  if (res.error) {
    throw new Error(res.error);
  }
  return res;
};

export const parseRGBText = (rgbText: RGBText) => {
  const res = parseRGBTextInfo(rgbText);
  if (res.error) {
    throw new Error(res.error);
  }
  return res;
};

const parseHexInfo = (hex: Hex) => {
  if (typeof hex === 'string') {
    const matches = hex.match(/^(\#|0x)?([A-Fa-f\d]{1,8})$/);
    if (matches) {
      const tag = matches[1];
      const t = matches[2];

      let text = null;
      if (t.length === 2) {
        text = t + t + t;
      } else if (t.length === 3) {
        text = t[0] + t[0] + t[1] + t[1] + t[2] + t[2];
      } else if (t.length === 6) {
        text = t;
      } else {
        return {
          error: 'Number of hex characters is invalid. needs to be 2, 3, or 6.',
        };
      }

      return {
        text,
        tag,
        isTagged: tag === '#' || tag === '0x',
        isUppercase: /[A-Z]/.test(t),
        originalText: t,
      };
    } else {
      return {
        error: 'Failed to interpret hex string: ' + hex,
      };
    }
  } else {
    return {
      error: 'Hex value is not a string string: ' + hex,
    };
  }
};

const parseRGBTextInfo = (rgbText: RGBText) => {
  if (typeof rgbText === 'string') {
    const matches = rgbText.match(
      /^(rgb)\((\d{1,3}) *, *(\d{1,3}) *, *(\d{1,3}) *\)$/
    );
    if (matches) {
      const name = matches[1];
      const r = parseInt(matches[2]);
      const g = parseInt(matches[3]);
      const b = parseInt(matches[4]);

      return {
        name,
        rgb: { r, g, b },
      };
    } else {
      return {
        error: 'Failed to interpret rgb text string: ' + rgbText,
      };
    }
  } else {
    return {
      error: 'Rgb text is not of type string: ' + rgbText,
    };
  }
};

const isHSL = (value: any) => {
  if (value) {
    if (typeof value === 'object') {
      if (
        value.hasOwnProperty('h') &&
        value.hasOwnProperty('s') &&
        value.hasOwnProperty('l')
      ) {
        return true;
      }
    }
  }
  return false;
};

const isRGB = (value: any) => {
  if (value) {
    if (typeof value === 'object') {
      if (
        value.hasOwnProperty('r') &&
        value.hasOwnProperty('g') &&
        value.hasOwnProperty('b')
      ) {
        return true;
      }
    }
  }
  return false;
};

// ----------------------------------------------------------------------------

const rgbMetrics = (rgb: RGB) => {
  const items = [rgb.r, rgb.g, rgb.b];
  let max = rgb.r / 255;
  let maxIndex = 0;
  let min = rgb.r / 255;
  let minIndex = 0;
  for (let i = 1; i < items.length; i++) {
    const val = items[i] / 255;
    if (val > max) {
      max = val;
      maxIndex = i;
    }
    if (val < min) {
      min = val;
      minIndex = i;
    }
  }
  return {
    max,
    maxIndex,
    min,
    minIndex,
  };
};

// ----------------------------------------------------------------------------

/**
 * hex string in form `#ff...`, `ff...`, or `0xff...`
 *
 * Can be upper case or lower case
 *
 * Formats:
 * - **#00 (2 hexit)** - gray scale color (`#f0` => `#f0f0f0`)
 * - **#000 (3 hexit)** - rgb shorthand (`#fe4` => `#ffee44`)
 * - **#000000 (6 hexit)** - standard rgb hex color (`#rrggbb`)
 */
export type Hex = string;

/** values range from 0-1 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/** values range from 0-1 */
export interface HSV {
  h: number;
  s: number;
  v: number;
}

/** values range from 0-255 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** String in format `rgb(0, 0, 0)` */
export type RGBText = string;

/** string color name like 'red' or 'blue' */
export type Name = string;

/**
 * - **hex** - hex string
 * - **hsl** - {h,s,l} object
 * - **rgb** - {r,g,b} object
 * - **rgbText** - string in format "rgb(0, 0, 0)"
 */
export type Format = 'Hex' | 'HSL' | 'RGB' | 'RGBText' | 'Name';

export type Color = Hex | HSL | RGB | RGBText;

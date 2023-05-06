import * as c from './color';
import { percentage } from './utils';

export const lighten = (color: any, amount: number) => {
  const { type } = c.detail(color);
  const hsl = c.convert(color, type, 'HSL');
  const p = percentage(amount);
  hsl.l += (1 - hsl.l) * p;
  return c.convert(hsl, 'HSL', type);
};

export const darken = (color: any, amount: number) => {
  return lighten(color, -percentage(amount));
};

export const mix = (colorA: any, colorB: any, weight: number) => {
  const { type } = c.detail(colorA);
  const rgb1 = c.convert(colorA, type, 'RGB');
  const rgb2 = c.convertTo(colorB, 'RGB');
  const p = 1 - percentage(weight);
  const r = rgb1.r + (rgb2.r - rgb1.r) * p;
  const g = rgb1.g + (rgb2.g - rgb1.g) * p;
  const b = rgb1.b + (rgb2.b - rgb1.b) * p;
  const rgb = c.rgb(r, g, b);
  return c.convert(rgb, 'RGB', type);
};

export const alpha = (color: any, alpha: number) => {
  const rgb = c.convertTo(color, 'RGB');
  const p = percentage(alpha);
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p})`;
};

export const contrast = (color: any) => {
  const { type } = c.detail(color);
  const hsl = c.convert(color, type, 'HSL');
  if (hsl.l < 0.65) {
    hsl.l += 0.3;
  } else {
    hsl.l -= 0.4;
  }
  hsl.s *= 0.5;
  return c.convert(hsl, 'HSL', type);
};

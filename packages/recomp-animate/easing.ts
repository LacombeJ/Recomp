/** For functions that do not have a direct inverse, try to approximate some other way */
export type Easing = {
  forward: (x: number) => number;
  inverse: (y: number) => number;
};

export const easeLinear: Easing = {
  forward: (x) => x,
  inverse: (y) => y,
};

export const easeOutQuart: Easing = {
  forward: (x) => 1 - Math.pow(1 - x, 4),
  inverse: (y) => 1 - Math.pow(1 - y, 0.25),
};

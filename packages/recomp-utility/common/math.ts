export const modulo = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const clamp = (x: number, min = 0, max = 1) => {
  return x < min ? min : x > max ? max : x;
};

export const isClamped = (x: number, min = 0, max = 1) => {
  return x > min && x < max;
};

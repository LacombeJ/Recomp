export const modulo = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const clamp = (x: number, min: number, max: number) => {
  return x < min ? min : x > max ? max : x;
};

export const hue2rgb = (p: number, q: number, t: number) => {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
  return p;
};

/**
 * Returns float number indicating a percentage where 0 is 0% and 1 is 100%
 */
export const percentage = (amount: number | string) => {
  if (typeof amount === 'number') {
    return amount;
  }

  const matches = amount.match(/^(\-|\+)?((\d*.)?\d+)(%)?$/);
  if (matches) {
    const sign = matches[1];
    const value = Number(matches[2]);
    const percentage = matches[3];

    let multiplier = 1;
    if (sign === '-') {
      multiplier = -1;
    }

    if (percentage === '%') {
      return (value / 100) * multiplier;
    }

    return value * multiplier;
  } else {
    throw new Error('Could not determine percentage from amount: ' + amount);
  }
};

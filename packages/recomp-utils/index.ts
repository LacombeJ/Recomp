// https://github.com/JedWatson/classnames/blob/master/index.js

export const classes = (...args: any): any[] => {
  const items = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) continue;

    const argType = typeof arg;
    if (argType === 'string' || argType === 'number') {
      items.push(...arg.split(' '));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classes(...arg);
        if (inner) {
          items.push(...inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString === Object.prototype.toString) {
        for (let key in arg) {
          if (arg.hasOwnProperty(key) && arg[key]) {
            items.push(key);
          }
        }
      } else {
        items.push(arg.toString());
      }
    }
  }

  return items;
};

export const classnames = (...args: any) => {
  return classes(...args).join(' ');
};

export const defineStyle = (classNames: any, definition: any) => {
  const classItems = classes(classNames);
  const style: { [key: string]: any } = {};

  const keys = Object.keys(definition);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = definition[key];
    if (typeof value === 'object') {
      const selectors = splitClassSelectors(key);
      if (selectorMatch(classItems, selectors)) {
        Object.assign(style, value);
      }
    } else {
      style[key] = value;
    }
  }

  return style;
};

export const splitClassSelectors = (text: string) => {
  const items = [];
  const regex = /\.([^.]+)/g;
  const results = text.matchAll(regex);
  for (const result of results) {
    items.push(result[1]);
  }
  return items;
};

export const selectorMatch = (classItems: string[], selectors: string[]) => {
  for (let i = 0; i < selectors.length; i++) {
    if (!classItems.includes(selectors[i])) {
      return false;
    }
  }
  return true;
};

// ----------------------------------------------------------------------------

/**
 * Joins two (possibly) nested objects, preferring values of the second argument.
 * It is similar to using `{..left, ...right}` but does it recursively. Also, values
 * of undefined values that are undefined do not have preference
 */
export const structureUnion = (left: any, right: any) => {
  const leftObj = left as any;
  const rightObj = right as any;

  if (rightObj === undefined) {
    return leftObj;
  }
  if (leftObj === undefined) {
    return rightObj;
  }

  let result: any = {};

  if (typeof leftObj === 'object' && leftObj !== null) {
    // Add all left values
    const leftKeys = Object.keys(leftObj);
    for (const lk of leftKeys) {
      result[lk] = structureUnion(leftObj[lk], undefined);
    }
  } else {
    result = leftObj;
  }

  // Add all right values, will override values
  if (typeof rightObj === 'object' && rightObj !== null) {
    const rightKeys = Object.keys(rightObj);
    for (const rk of rightKeys) {
      result[rk] = structureUnion(leftObj[rk], rightObj[rk]);
    }
  } else {
    result = rightObj;
  }

  return result;
};

// ----------------------------------------------------------------------------

const FRACTION = 8;

export const parseSize = (str: string | number) => {
  str = String(str);
  const matches = str.match(/^([0-9]+(?:\.[0-9]+)?)((px|%)?)$/);
  const value = Number(matches[1]);
  const unit = matches[2];
  return { value, unit };
};

export const toSize = (
  size: number,
  unit: '%' | 'px' | 'ratio',
  containerSize: number
) => {
  switch (unit) {
    case '%':
      return `${((size / containerSize) * 100).toFixed(FRACTION)}%`;
    case 'px':
      return `${size.toFixed(FRACTION)}px`;
    case 'ratio':
      return (size * 100).toFixed(0);
  }
};

export const toPixels = (value: number, unit = 'px', size: number) => {
  switch (unit) {
    case '%': {
      return ((size * value) / 100).toFixed(FRACTION);
    }
    default: {
      return value;
    }
  }
};

export const getSizeUnit = (size: string | number) => {
  size = String(size);
  if (size.endsWith('px')) {
    return 'px';
  }
  if (size.endsWith('%')) {
    return '%';
  }
  return 'ratio';
};

export const convertSizeToPixels = (
  str: string | number,
  containerSize: number
) => {
  const res = parseSize(str);
  return toPixels(res.value, res.unit, containerSize);
};

export const convertSizeToStyleValue = (
  value: string | number,
  containerSize: number
) => {
  if (getSizeUnit(value) !== '%') {
    return value;
  }

  const size = parseSize(value);
  const percent = size.value / 100;
  if (percent === 0) {
    return value;
  }

  return `calc(${value} - ${containerSize}px*${percent})`;
};

// ----------------------------------------------------------------------------

export const offsets = (
  clientX: number,
  clientY: number,
  rect: { left: number; top: number; width: number; height: number }
) => {
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const xr = x / rect.width;
  const yr = y / rect.height;
  const xp = xr * 100;
  const yp = yr * 100;
  return { x, y, xr, yr, xp, yp };
};

/**
 * Returns the min/max boundaries resizing a resize splitter
 */
export const resizeBoundary = (
  containerSize: number,
  min1: number,
  max1: number,
  min2: number,
  max2: number
) => {
  const defaultMin = 0;
  const defaultMax = containerSize;
  const minPx1 = min1 ? convertSizeToPixels(min1, containerSize) : defaultMin;
  const maxPx1 = max1 ? convertSizeToPixels(max1, containerSize) : defaultMax;
  const minPx2 = min2 ? convertSizeToPixels(min2, containerSize) : defaultMin;
  const maxPx2 = max2 ? convertSizeToPixels(max2, containerSize) : defaultMax;
  const min = Math.max(Number(minPx1), containerSize - Number(maxPx2));
  const max = Math.min(Number(maxPx1), containerSize - Number(minPx2));
  return { min, max };
};

export const targetSize = (
  containerSize: number,
  value: number,
  min: number,
  max: number
) => {
  if (value <= min) {
    return toSize(min, '%', containerSize);
  } else if (value >= max) {
    return toSize(max, '%', containerSize);
  } else {
    return toSize(value, '%', containerSize);
  }
};

export const flipDirection = (direction: Direction) => {
  if (direction === 'vertical') return 'horizontal';
  if (direction === 'horizontal') return 'vertical';
  return direction;
};

/**
 * @param {'vertial'|'horizontal'} direction
 */
export const boundaryLabel = (direction: Direction) => {
  const isVertical = direction === 'vertical';
  return {
    min: isVertical ? 'minHeight' : 'minWidth',
    max: isVertical ? 'maxHeight' : 'maxWidth',
    size: isVertical ? 'height' : 'width',
    pos: isVertical ? 'y' : 'x',
    stack: isVertical ? 'column' : 'row',
    front: isVertical ? 'top' : 'left',
    back: isVertical ? 'bottom' : 'right',
  };
};

export const flexSizeStyle = (
  direction: Direction,
  size: number,
  defaultSize: number,
  minSize: number,
  maxSize: number,
  containerSize: number
) => {
  const value = size ? size : defaultSize;
  const label = boundaryLabel(direction);

  const style: { [key: string]: any } = {};

  style[label.min] = convertSizeToStyleValue(minSize, containerSize);
  style[label.max] = convertSizeToStyleValue(maxSize, containerSize);

  const unit = getSizeUnit(value);

  if (unit === 'ratio') {
    style.flex = value;
  } else if (unit == 'px') {
    style.flexGrow = 0;
    style[label.size] = convertSizeToStyleValue(value, containerSize);
  }

  return style;
};

export const sizeStyle = (direction: Direction, size: Size) => {
  const label = boundaryLabel(direction);
  return {
    [label.size]: size,
  };
};

export const sizeInverse = (containerSize: number, size: number) => {
  const res = parseSize(size);
  if (res.unit === '%') {
    return 100 - res.value + '%';
  } else if (res.unit === 'px') {
    return containerSize - res.value + 'px';
  }
  return null;
};

export const boundarySizeStyle = (
  direction: Direction,
  minSize: Size,
  maxSize: Size
) => {
  const label = boundaryLabel(direction);
  return {
    [label.min]: minSize,
    [label.max]: maxSize,
  };
};

type Size = string | number;
type Direction = 'vertical' | 'horizontal';

declare module '@recomp/utils';

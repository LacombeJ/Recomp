// https://github.com/JedWatson/classnames/blob/master/index.js

/**
 * @param  {...any} args
 * @returns {any[]}
 */
export const classes = (...args) => {
  const items = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg) continue;

    const argType = typeof arg;
    if (argType === "string" || argType === "number") {
      items.push(...arg.split(" "));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classes(...arg);
        if (inner) {
          items.push(...inner);
        }
      }
    } else if (argType === "object") {
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

export const classnames = (...args) => {
  return classes(...args).join(" ");
};

/**
 * Returns a style object
 * @param {any} classNames
 * @param {any} definition
 */
export const defineStyle = (classNames, definition) => {
  const classItems = classes(classNames);
  const style = {};

  const keys = Object.keys(definition);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = definition[key];
    if (typeof value === "object") {
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

/**
 * @param {string} text
 */
export const splitClassSelectors = (text) => {
  const items = [];
  const regex = /\.([^.]+)/g;
  const results = text.matchAll(regex);
  for (const result of results) {
    items.push(result[1]);
  }
  return items;
};

/**
 *
 * @param {string[]} classItems
 * @param {string[]} selectors
 */
export const selectorMatch = (classItems, selectors) => {
  for (let i = 0; i < selectors.length; i++) {
    if (!classItems.includes(selectors[i])) {
      return false;
    }
  }
  return true;
};

// ----------------------------------------------------------------------------

const FRACTION = 8;

export const parseSize = (str) => {
  const matches = str.match(/^([0-9]+(?:\.[0-9]+)?)((px|%)?)$/);
  const value = Number(matches[1]);
  const unit = matches[2];
  return { value, unit };
};

export const toSize = (size, unit, containerSize) => {
  switch (unit) {
    case "%":
      return `${((size / containerSize) * 100).toFixed(FRACTION)}%`;
    case "px":
      return `${size.toFixed(FRACTION)}px`;
    case "ratio":
      return (size * 100).toFixed(0);
  }
};

/**
 * @returns {string}
 */
export const toPixels = (value, unit = "px", size) => {
  switch (unit) {
    case "%": {
      return ((size * value) / 100).toFixed(FRACTION);
    }
    default: {
      return value;
    }
  }
};

export const getSizeUnit = (size) => {
  if (size.endsWith("px")) {
    return "px";
  }
  if (size.endsWith("%")) {
    return "%";
  }
  return "ratio";
};

export const convertSizeToPixels = (str, containerSize) => {
  const res = parseSize(str);
  return toPixels(res.value, res.unit, containerSize);
};

export const convertSizeToStyleValue = (value, containerSize) => {
  if (getSizeUnit(value) !== "%") {
    return value;
  }

  const size = parseSize(value, containerSize);
  const percent = size.value / 100;
  if (percent === 0) {
    return value;
  }

  return `calc(${value} - ${containerSize}px*${percent})`;
};

// ----------------------------------------------------------------------------

export const offsets = (clientX, clientY, rect) => {
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
export const resizeBoundary = (containerSize, min1, max1, min2, max2) => {
  const defaultMin = 0;
  const defaultMax = containerSize;
  const minPx1 = min1 ? convertSizeToPixels(min1, containerSize) : defaultMin;
  const maxPx1 = max1 ? convertSizeToPixels(max1, containerSize) : defaultMax;
  const minPx2 = min2 ? convertSizeToPixels(min2, containerSize) : defaultMin;
  const maxPx2 = max2 ? convertSizeToPixels(max2, containerSize) : defaultMax;
  const min = Math.max(minPx1, containerSize - maxPx2);
  const max = Math.min(maxPx1, containerSize - minPx2);
  return { min, max };
};

export const targetSize = (containerSize, value, min, max) => {
  if (value <= min) {
    return toSize(min, "%", containerSize);
  } else if (value >= max) {
    return toSize(max, "%", containerSize);
  } else {
    return toSize(value, "%", containerSize);
  }
};

/**
 * @param {'vertial'|'horizontal'} direction
 */
export const flipDirection = (direction) => {
  if (direction === "vertical") return "horizontal";
  if (direction === "horizontal") return "vertical";
  return direction;
};

/**
 * @param {'vertial'|'horizontal'} direction
 */
export const boundaryLabel = (direction) => {
  const isVertical = direction === "vertical";
  return {
    min: isVertical ? "minHeight" : "minWidth",
    max: isVertical ? "maxHeight" : "maxWidth",
    size: isVertical ? "height" : "width",
    pos: isVertical ? "y" : "x",
    stack: isVertical ? "column" : "row",
    front: isVertical ? "top" : "left",
    back: isVertical ? "bottom" : "right",
  };
};

export const flexSizeStyle = (
  direction,
  size,
  defaultSize,
  minSize,
  maxSize,
  containerSize
) => {
  const value = size ? size : defaultSize;
  const label = boundaryLabel(direction);

  const style = {};

  style[label.min] = convertSizeToStyleValue(minSize, containerSize);
  style[label.max] = convertSizeToStyleValue(maxSize, containerSize);

  const unit = getSizeUnit(value);

  if (unit === "ratio") {
    style.flex = value;
  } else if (unit == "px") {
    style.flexGrow = 0;
    style[label.size] = convertSizeToStyleValue(value, containerSize);
  }

  return style;
};

export const sizeStyle = (direction, size) => {
  const label = boundaryLabel(direction);
  return {
    [label.size]: size,
  };
};

export const sizeInverse = (containerSize, size) => {
  const res = parseSize(size);
  if (res.unit === "%") {
    return 100 - res.value + "%";
  } else if (res.unit === "px") {
    return containerSize - res.value + "px";
  }
  return null;
};

export const boundarySizeStyle = (direction, minSize, maxSize) => {
  const label = boundaryLabel(direction);
  return {
    [label.min]: minSize,
    [label.max]: maxSize,
  };
};

declare module '@recomp/utils';

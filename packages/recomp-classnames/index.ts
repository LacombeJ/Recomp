// https://github.com/JedWatson/classnames/blob/master/index.js

type Classifiable = string | [string | null | undefined, boolean | null | undefined];

export const classesExp = (...args: Classifiable[]): string[] => {
  const items: string[] = [];

  for (const arg of args) {
    if (typeof arg === 'string') {
      const classname = arg;
      items.push(classname);
    } else if (typeof arg === 'object') {
      const [classname, condition] = arg;
      if (classname && condition) {
        items.push(classname);
      }
    }
  }

  return items;
};

export const classnamesEXP = (...args: Classifiable[]) => {
  return classesExp(...args).join(' ');
};

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

export const selectClassName = (classNames: any, key: any) => {
  if (classNames[key]) {
    return { [classNames[key]]: true };
  }
  return {};
};

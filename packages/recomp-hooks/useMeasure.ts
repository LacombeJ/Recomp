// modified from: https://github.com/streamich/react-use/blob/master/src/useMeasure.ts
// with assuming that this only runs in a browser (window !== undefined).
// also, returns both content rect and bounding client rect

import * as React from 'react';

export type MeasureResult = {
  contentRect: Rect;
  clientRect: Rect;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
};

const useElementRect = <E extends Element>(): [
  (element: E) => void,
  MeasureResult
] => {
  const [element, ref] = React.useState(null);
  const [rect, setRect] = React.useState<MeasureResult>({
    clientRect: defaultRect(),
    contentRect: defaultRect(),
  });

  const observer = React.useMemo(() => {
    return new window.ResizeObserver((entries) => {
      const firstEntry = entries[0];
      if (firstEntry) {
        setRect({
          contentRect: getRect(firstEntry.contentRect),
          clientRect: getRect(firstEntry.target.getBoundingClientRect()),
        });
      }
    });
  }, []);

  React.useLayoutEffect(() => {
    if (!element) {
      return;
    }

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [ref, rect];
};

const getRect = (from: Rect): Rect => {
  const { x, y, width, height, top, left, bottom, right } = from;
  return { x, y, width, height, top, left, bottom, right };
};

const defaultRect = (): Rect => {
  return {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  };
};

export default useElementRect;

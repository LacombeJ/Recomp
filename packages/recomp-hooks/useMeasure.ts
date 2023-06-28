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

/**
 * Listens to resize events and obtain rect. This does not listen
 * to all position change events (ex: sibling moves which moves
 * measured element, failing to trigger an update).
 */
export const useMeasure = <E extends Element>(): [
  (element: E) => void,
  MeasureResult
] => {
  const elementRef = React.useRef<Element>(null);

  const [rect, setRect] = React.useState<MeasureResult>({
    clientRect: defaultRect(),
    contentRect: defaultRect(),
  });

  const handleSetRef = React.useCallback((element: Element) => {
    if (element && elementRef.current !== element) {
      elementRef.current = element;
      // When setting ref for the first time, update clientRect
      setRect({
        ...rect,
        clientRect: getRect(elementRef.current.getBoundingClientRect()),
      });
    }
  }, []);

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
    if (!elementRef.current) {
      return;
    }

    observer.observe(elementRef.current);
    return () => {
      observer.disconnect();
    };
  }, [elementRef.current]);

  return [handleSetRef, rect];
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

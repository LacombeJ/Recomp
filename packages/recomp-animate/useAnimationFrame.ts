import * as React from 'react';

// modified: https://css-tricks.com/using-requestanimationframe-with-react-hooks/
export const useAnimationFrame = (
  callback: (timeOffsetMS: number, deltaTimeMS: number) => void | boolean
) => {
  const requestRef = React.useRef<number>(null);
  const previousTimeRef = React.useRef<number>(null);
  const initialTimeRef = React.useRef<number>(null);

  const animate = (time: number) => {
    if (initialTimeRef.current === null) {
      initialTimeRef.current = time;
    }

    let next = true;

    if (previousTimeRef.current !== null) {
      const deltaTime = time - previousTimeRef.current;
      const timeOffset = time - initialTimeRef.current;
      const result = callback(timeOffset, deltaTime);
      if (result !== undefined) {
        next = result as boolean;
      }
    }

    previousTimeRef.current = time;
    if (next) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancel();
    }
  };

  const isAnimating = () => {
    return requestRef.current !== null;
  };

  const begin = () => {
    requestRef.current = requestAnimationFrame(animate);
  };

  const cancel = () => {
    cancelAnimationFrame(requestRef.current);
    requestRef.current = null;
    previousTimeRef.current = null;
    initialTimeRef.current = null;
  };

  return { begin, cancel, isAnimating };
};

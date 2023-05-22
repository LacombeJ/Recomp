import * as React from 'react';
import { useMeasure } from './useMeasure';

/**
 * React hook for creating a callback on component resize.
 * This just uses measure but only considers width and height
 * dimensions
 */
export const useSize = (
  callback: (size: { width: number; height: number }) => any
) => {
  const [setRef, measure] = useMeasure();
  const { width, height } = measure.clientRect;
  React.useEffect(() => {
    callback({ width, height });
  }, [width, height]);
  return setRef;
};

import * as React from 'react';

import { useAnimationFrame } from './useAnimationFrame';
import { clamp } from './util';

export const useAnimationValue = (
  from: number,
  to: number,
  duration: number,
  loop?: boolean,
  onComplete?: () => any
) => {
  const startOffsetRef = React.useRef<number>(null);
  const [value, setValue] = React.useState(from);

  const { begin } = useAnimationFrame((timeOffsetMS) => {
    if (!startOffsetRef.current) {
      startOffsetRef.current = timeOffsetMS;
    }

    const alpha = clamp((timeOffsetMS - startOffsetRef.current) / duration);

    const interpolated = (to - from) * alpha + from;

    setValue(interpolated);

    if (alpha >= 1) {
      onComplete?.();
      if (loop) {
        startOffsetRef.current = timeOffsetMS;
      } else {
        return false;
      }
    }
  });

  React.useEffect(() => {
    begin();
  }, []);

  return value;
};

import * as React from 'react';

/**
 * Returns the previously used value by storing in ref and only updating
 * past value when changed
 */
const usePrevious = <T>(value: T): T => {
  const ref: React.MutableRefObject<T> = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export default usePrevious;

import * as React from 'react';

const useTimeout = (
  ms: number
): {
  begin: (callback: () => void) => void;
  cancel: () => void;
} => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const begin = (callback: () => void) => {
    cancel(); // cancel previous if it existed

    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = undefined;
    }, ms);
  };

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return { begin, cancel };
};

export default useTimeout;

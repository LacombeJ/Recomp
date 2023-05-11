import * as React from 'react';

const useTimeout = (): {
  begin: (ms: number, callback: () => void) => void,
  cancel: () => void
} => {
  const timeoutRef: React.MutableRefObject<NodeJS.Timeout> = React.useRef();

  const begin = (ms: number, callback: () => void) => {
    timeoutRef.current = setTimeout(callback, ms);
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

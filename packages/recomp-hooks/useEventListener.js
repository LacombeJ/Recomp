import React from 'react';

const useEventListener = (
  element,
  type,
  listener,
  options,
  skipAdd = false
) => {
  React.useEffect(() => {
    if (!skipAdd) {
      element.addEventListener(type, listener, options);
    }
    return () => {
      element.removeEventListener(type, listener, options);
    };
  });
};

export default useEventListener;

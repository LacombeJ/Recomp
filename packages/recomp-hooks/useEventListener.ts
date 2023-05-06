import * as React from 'react';

const useEventListener = (
  element: any,
  type: any,
  listener: (this: HTMLElement, ev: any) => any,
  options?: boolean | AddEventListenerOptions,
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

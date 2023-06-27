import * as React from 'react';

export const useEventListener = <T extends Window | Document | HTMLElement>(
  item: T,
  type: Parameters<T['addEventListener']>[0],
  listener: Parameters<T['addEventListener']>[1],
  options?: Parameters<T['addEventListener']>[2],
  skipAdd = false
) => {
  React.useEffect(() => {
    if (!skipAdd) {
      item.addEventListener(type, listener, options);
    }
    return () => {
      item.removeEventListener(type, listener, options);
    };
  });
};

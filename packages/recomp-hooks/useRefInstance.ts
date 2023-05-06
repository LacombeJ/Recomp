import * as React from 'react';

/**
 * Use ref initiated once with the given callback
 */
const useRefInstance = <T>(
  value: T,
  effect: () => any = () => {}
): React.MutableRefObject<T> => {
  const ref = React.useRef(undefined);

  const callback = React.useCallback(() => {
    if (ref.current === undefined) {
      ref.current = value;
      return effect();
    }
  }, [value, effect]);

  React.useEffect(callback, [ref]);

  return ref;
};

export default useRefInstance;

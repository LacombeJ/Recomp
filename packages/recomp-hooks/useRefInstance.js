import React from 'react';

/**
 * Use ref initiated once with the given callback
 * @template T
 * @param {T} value
 * @param {() => any} effect
 * @returns {React.MutableRefObject<T>}
 */
const useRefInstance = (value, effect = () => {}) => {
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

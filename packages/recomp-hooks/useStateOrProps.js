import React from 'react';

/**
 * @template T
 * @param {T} initialState
 * @param {T} propValue
 * @param {(value: T) => void} propCallback
 * @param useProps
 * @returns {[T, (newState: any, callback: (value: T) => void]}
 */
const useStateOrProps = (
  initialState,
  propValue,
  propCallback,
  useProps = propValue !== undefined
) => {
  const [state, setState] = React.useState(initialState);

  let actualValue = state;
  let actualCallback = setState;

  if (useProps) {
    actualValue = propValue;
    actualCallback = propCallback;
  }

  return [actualValue, actualCallback];
};

export default useStateOrProps;

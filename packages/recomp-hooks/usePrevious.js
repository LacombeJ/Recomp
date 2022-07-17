import React from 'react';

/**
 * Returns the previously used value by storing in ref and only updating
 * past value when changed
 *
 * @param {T} value
 * @returns {T}
 */
function usePrevious(value) {
  const ref = React.useRef();

  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

export default usePrevious;

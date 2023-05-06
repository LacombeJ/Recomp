import * as React from 'react';

/**
 * Use effect after initial mount
 */
const usePostEffect = (effect: () => any, deps: any, applyChanges = true) => {
  const isInitialMount = React.useRef(true);

  if (isInitialMount.current || !applyChanges) {
    effect = () => {
      isInitialMount.current = false;
    };
  }

  React.useEffect(effect, deps);
};

export default usePostEffect;

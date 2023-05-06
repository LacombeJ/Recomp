import * as React from 'react';

/** Use this effect only when isReady flag is true */
const useEffectOnReady = (effect: () => any, deps: any[] = [], isReady: boolean = false) => {
  const wrappedEffect = React.useCallback(() => {
    if (isReady) {
      return effect();
    }
  }, [isReady, effect]);

  const dependencies = [...deps, isReady];

  React.useEffect(wrappedEffect, dependencies);
};

export default useEffectOnReady;

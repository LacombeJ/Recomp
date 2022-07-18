import React from 'react';

/**
 * Use this effect only when isReady flag is true
 * @param {() => {}} effect 
 * @param {any[]} deps 
 * @param {bool} isReady 
 */
const useEffectOnReady = (effect, deps = [], isReady = false) => {
  const wrappedEffect = React.useCallback(() => {
    if (isReady) {
      return effect();
    }
  }, [isReady, effect]);

  const dependencies = [...deps, isReady];

  React.useEffect(wrappedEffect, dependencies);
};

export default useEffectOnReady;

import * as React from 'react';

/**
 * A hook that preserves a state object that can be modified when deps change.
 * Unlike React.useMemo which performs a new calculation when a state changes,
 * this hook provides the previous state to update.
 */
export const useMemoizedState = <S, T>(
  defaultState: S,
  factory: (state: S) => T,
  deps: React.DependencyList
) => {
  const state = React.useRef(defaultState);
  return React.useMemo(() => {
    return factory(state.current);
  }, [deps]);
};

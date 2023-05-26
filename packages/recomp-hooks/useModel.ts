import * as React from 'react';

import { produce, Draft } from 'immer';

export type Recipe<S> = (state: Draft<S>) => any;
export type Action<S> = (state: S) => S;
export type Update<S> = (action: Action<S>) => any;
export type { Draft };

/**
 * This hook is similar to useStateOrProps but uses immer to
 * pass recipe's up when props are being used, or to update
 * state directly when state is being used
 */
export const useModel = <S>(
  defaultState: S,
  propValue: S = undefined,
  propCallback: Update<S> = undefined,
  useProps: boolean = propValue !== undefined
): [S, (recipe: Recipe<S>) => void] => {
  const [state, setState] = React.useState(defaultState);

  let actualValue = state;
  if (useProps) {
    actualValue = propValue;
  }

  const updateValue = (recipe: Recipe<S>) => {
    const result = produce<S>(recipe);
    if (useProps) {
      propCallback(result);
    } else {
      setState(result);
    }
  };

  return [actualValue, updateValue];
};

import * as React from 'react';
import useTimeout from './useTimeout';

/**
 * Range that indicates debounce lifecycle
 */
export type DebounceThreshold = {
  /** If time since last update is less than minimumm, will not update */
  min: number;

  /** If time since last update is greater than maximum, will update immediately */
  max?: number;
};

/**
 * Runs debouncing based on given threshold
 * @param threshold debounce min/max
 * @param factory function to create value
 * @param deps dependency list that indicates a change
 * @param initialize Optional callback that indicates whether the lifecycle
 * should start or not. The initial value will still be provided via
 * factory but debouncing won't start until this passes.
 * @returns a debounced value created by the given factory
 */
export const useDebouncedMemo = <T>(
  threshold: DebounceThreshold,
  factory: () => T,
  deps: React.DependencyList,
  initialize?: () => boolean
) => {
  const init = React.useRef(false);
  const forced = React.useRef(false);

  // Value is to have updates on state change (in immediate cases)
  const valueRef = React.useRef(factory());
  // State is to trigger re-render in debounced cases
  const [_, setValue] = React.useState(valueRef.current);

  const previousEdit = React.useRef({ cancel: false });
  const passedMaxThreshold = React.useRef(false);

  const minTimeout = useTimeout(threshold.min);
  const maxTimeout = useTimeout(threshold.max ?? 0);

  const setActualValue = (to: T) => {
    valueRef.current = to;
    setValue(to);
  };

  const force = initialize ? initialize() : false;
  if (!forced.current && force) {
    setActualValue(factory());
    forced.current = true;
  }

  React.useEffect(() => {
    previousEdit.current.cancel = true;

    const currentEdit = { cancel: false };
    previousEdit.current = currentEdit;

    if (!init.current) {
      init.current = true;
      // Initialized, this counts as an update
      if (threshold.max !== undefined) {
        maxTimeout.begin(() => {
          passedMaxThreshold.current = true;
        });
      }
    } else {
      if (threshold.max !== undefined && passedMaxThreshold.current) {
        // If passed max threshold, update immediate
        setActualValue(factory());
        passedMaxThreshold.current = false;
        maxTimeout.begin(() => {
          passedMaxThreshold.current = true;
        });
      } else {
        // If under max threshold, run debouncing
        minTimeout.begin(() => {
          if (!currentEdit.cancel) {
            setActualValue(factory());
          }
        });
      }
    }
  }, [...deps]);

  return valueRef.current;
};

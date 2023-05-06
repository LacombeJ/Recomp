import * as React from 'react';

/**
 * This effect is use to toggle ready after some conditions
 * are met. It returns the ready state and a callback used
 * to call when ready check should occur
 */
const useReady = (readyCheck: () => boolean): [boolean, () => any] => {
  const [isReady, setReady] = React.useState(false);

  const checkReady = React.useCallback(() => {
    if (readyCheck()) {
      setReady(true);
    }
  }, [readyCheck]);

  return [isReady, checkReady];
};

export default useReady;

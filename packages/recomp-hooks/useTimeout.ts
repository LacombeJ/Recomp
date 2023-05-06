import * as React from 'react';

const useTimeout = (
  ms: number,
  handleDelayComplete: () => any,
  cancelOnUnmount: boolean = true
) => {
  const delayHandledRef: React.MutableRefObject<boolean> = React.createRef();
  React.useEffect(() => {
    setTimeout(() => {
      if (cancelOnUnmount && !delayHandledRef.current) {
        delayHandledRef.current = true;
        handleDelayComplete();
      }
    }, ms);
  });
};

export default useTimeout;

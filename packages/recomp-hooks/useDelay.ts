import * as React from 'react';

/** Returns a boolean state that is set to true only after some delay has passed */
const useDelay = (
  ms: number,
  onComplete?: () => any,
  cancelOnUnmount: boolean = true
): [boolean] => {
  const [delayed, setDelayed] = React.useState(false);

  const handleDelayComplete = () => {
    setDelayed(true);
    onComplete?.();
  };

  const delayHandledRef: React.MutableRefObject<boolean> = React.createRef();

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (cancelOnUnmount && !delayHandledRef.current) {
        delayHandledRef.current = true;
        handleDelayComplete();
      }
    }, ms);

    return () => {
      if (cancelOnUnmount) {
        clearTimeout(timeout);
      }
    }
  });

  return [delayed];
};

export default useDelay;

import React from "react";

const useTimeout = (ms, handleDelayComplete, cancelOnUnmount = true) => {
  const delayHandledRef = React.createRef(null);
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

import * as React from 'react';

import { useTimeout } from '@recomp/hooks';

interface DelayProps {
  ms?: number;
  onComplete?: () => any;
  children?: React.ReactNode;
}

const Delay = (props: DelayProps) => {
  props = { ...defaultProps, ...props };

  const [show, setShow] = React.useState(false);

  const handleDelayComplete = () => {
    setShow(true);
    props.onComplete();
  };

  useTimeout(props.ms, handleDelayComplete);

  if (show && props.children) {
    return props.children;
  } else {
    return null;
  }
};

const defaultProps = {
  ms: 1000,
  onComplete: () => {},
};

export default Delay;

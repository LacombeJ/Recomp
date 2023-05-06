import * as React from 'react';

import { useEventListener } from '@recomp/hooks';

interface RootProps {
  className?: string;
  innerClassName?: string;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  onMount?: () => any;
  onUnmount?: () => any;
  onResize?: () => any;
  children?: React.ReactNode;
}

const Root = (props: RootProps) => {
  props = { ...defaultProps, ...props };

  useEventListener(document, 'resize', props.onResize);

  React.useEffect(() => {
    props.onMount();
    return () => {
      props.onUnmount();
    };
  });

  return (
    <div className={props.className} style={props.style}>
      <div className={props.innerClassName} style={props.innerStyle}>
        {props.children}
      </div>
    </div>
  );
};

const defaultProps = {
  className: 'recomp-root',
  style: {},
  innerClassName: 'sub',
  innerStyle: {},
  onMount: () => {},
  onUnmount: () => {},
  onResize: () => {},
};

export default Root;

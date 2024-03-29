import * as React from 'react';

import { propUnion } from '@recomp/props';

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

export const Root = (props: RootProps) => {
  props = propUnion(defaultProps, props);

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

const defaultProps: RootProps = {
  className: 'recomp-root',
  innerClassName: 'sub',
  onMount: () => {},
  onUnmount: () => {},
  onResize: () => {},
};

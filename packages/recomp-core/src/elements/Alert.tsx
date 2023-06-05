import * as React from 'react';

import * as util from '@recomp/utility/common';

import { animated } from '@react-spring/web';

import { useSize } from '@recomp/hooks';

interface AlertProps {
  className?: string;
  classNames?: {
    body?: string;
  };
  style?: React.CSSProperties;
  title: string;
  children?: React.ReactNode;
}

const AlertGeneric = (props: AlertProps) => {
  props = util.propUnion(defaultProps, props);
  const { className, style } = props;

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};

export const Alert = (props: AlertProps) => {
  props = util.propUnion(defaultProps, props);
  const { children, ...genericProps } = props;

  return (
    <AlertGeneric {...genericProps}>
      <div className={props.classNames.body}>{props.children}</div>
    </AlertGeneric>
  );
};

const defaultProps = {
  className: 'recomp-alert',
  classNames: {
    body: 'body',
  },
};

// ----------------------------------------------------------------------------

interface AlertAnimatedProps extends AlertProps {
  animatedStyle: any;
  onResize: (width: number, height: number) => void;
}

Alert.Animated = (props: AlertAnimatedProps) => {
  props = util.propUnion(defaultProps, props);

  const bodyRef = useSize(({ width, height }) => {
    props.onResize(width, height);
  });

  const { animatedStyle, children, ...genericProps } = props;

  return (
    <AlertGeneric {...genericProps}>
      <animated.div style={{ ...animatedStyle, overflow: 'hidden' }}>
        <div ref={bodyRef} className={props.classNames.body}>
          {props.children}
        </div>
      </animated.div>
    </AlertGeneric>
  );
};

import * as React from 'react';

import * as util from '@recomp/utility/common';

import { animated } from '@react-spring/web';

import { useSize } from '@recomp/hooks';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

interface TooltipProps {
  className?: string;
  classNames?: {
    triangle?: string;
    outline?: string;
    inner?: string;
    body?: string;
  };
  style?: React.CSSProperties;
  position?: TooltipPosition;
  children?: React.ReactNode;
  tipSize?: number;
  borderSize?: number;
}

const TooltipGeneric = (props: TooltipProps) => {
  props = util.propUnion(defaultProps, props);
  const { className, style } = props;

  return (
    <div className={className} style={style}>
      <Triangle
        className={props.classNames.triangle}
        classNames={{
          outline: props.classNames.outline,
          inner: props.classNames.inner,
        }}
        position={props.position}
        tipSize={props.tipSize}
        borderSize={props.borderSize}
      ></Triangle>
      {props.children}
    </div>
  );
};

export const Tooltip = (props: TooltipProps) => {
  props = util.propUnion(defaultProps, props);
  const { children, ...genericProps } = props;

  return (
    <TooltipGeneric {...genericProps}>
      <div className={props.classNames.body}>{props.children}</div>
    </TooltipGeneric>
  );
};

const defaultProps: TooltipProps = {
  className: 'recomp-tooltip',
  classNames: {
    triangle: 'triangle',
    outline: 'outline',
    inner: 'inner',
    body: 'body',
  },
  position: 'top',
  tipSize: 14,
  borderSize: 2,
};

// ----------------------------------------------------------------------------

interface TooltipAnimatedProps extends TooltipProps {
  animatedStyle: any;
  onResize: (width: number, height: number) => void;
}

Tooltip.Animated = (props: TooltipAnimatedProps) => {
  props = util.propUnion(defaultProps, props);

  const bodyRef = useSize(({ width, height }) => {
    props.onResize(width, height);
  });

  const { animatedStyle, children, ...genericProps } = props;

  return (
    <TooltipGeneric {...genericProps}>
      <animated.div style={{ ...animatedStyle, overflow: 'hidden' }}>
        <div ref={bodyRef} className={props.classNames.body}>
          {props.children}
        </div>
      </animated.div>
    </TooltipGeneric>
  );
};

// ----------------------------------------------------------------------------

interface TriangleProps {
  className?: string;
  classNames?: {
    outline?: string;
    inner?: string;
  };
  style?: React.CSSProperties;
  position?: TooltipPosition;
  tipSize?: number;
  borderSize?: number;
}

const Triangle = (props: TriangleProps) => {
  props = util.propUnion(triangleDefaultProps, props);

  const { tipSize, borderSize } = props;

  const className = util.classnames({
    [props.className]: true,
    [props.position]: true,
  });

  const style = {
    ...props.style,
  };

  // Add translate(0, 0) because of clipping issue:
  // https://stackoverflow.com/questions/26554832/keep-svg-element-on-exact-pixel
  switch (props.position) {
    case 'top':
      // tooltip appears on top, so arrow pointing down
      style.top = '100%';
      style.left = '50%';
      style.transform = 'translate(0, 0px) rotate(180deg)';
      break;
    case 'right':
      // tooltip appears to right, so arrow pointing left
      style.top = '50%';
      style.left = '0%';
      style.transform = 'translate(0, 0) rotate(-90deg)';
      break;
    case 'bottom':
      // tooltip appears on bottom, so arrow pointing up
      style.bottom = '100%';
      style.left = '50%';
      style.transform = 'translate(0, 0) rotate(0deg)';
      break;
    case 'left':
      // tooltip appears to left, so arrow pointing right
      style.top = '50%';
      style.right = '0%';
      style.transform = 'translate(0, 0) rotate(90deg)';
      break;
  }

  const borderSpan = Math.sqrt(borderSize);
  return (
    <span className={className} style={style}>
      <svg
        className="outline"
        fill="currentColor"
        width={tipSize}
        height={tipSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M 0 ${tipSize / 2} L ${tipSize / 2} 0 L ${tipSize} ${
            tipSize / 2
          }`}
        />
      </svg>
      <svg
        className="inner"
        fill="currentColor"
        width={tipSize}
        height={tipSize}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={`M ${borderSpan} ${tipSize / 2} L ${tipSize / 2} ${borderSpan} L ${
            tipSize - borderSpan
          } ${tipSize / 2}`}
        />
      </svg>
    </span>
  );
};

const triangleDefaultProps: TriangleProps = {
  className: 'triangle',
  classNames: {
    outline: 'outline',
    inner: 'inner',
  },
  position: 'top',
  tipSize: 14,
  borderSize: 2,
};

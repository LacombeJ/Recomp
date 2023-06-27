import * as React from 'react';

import * as util from '@recomp/utility/common';

import { animated } from '@react-spring/web';

import { useMouseHover, useSize } from '@recomp/hooks';
import { Overlay } from '../containers/Overlay';

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

// ----------------------------------------------------------------------------

type TooltipContextProps = {
  className?: string;
  classNames?: {
    offset?: string;
  };
  visible: boolean;
  offset: { x: number; y: number };
  position?: TooltipPosition;
  children?: React.ReactNode;
};

const Context = (props: TooltipContextProps) => {
  props = util.propUnion(defaultContextProps, props);

  return (
    <div className={props.className}>
      {props.visible ? (
        <div
          className={props.classNames.offset}
          style={{ left: `${props.offset.x}px`, top: `${props.offset.y}px` }}
        >
          <Tooltip position="bottom">{props.children}</Tooltip>
        </div>
      ) : null}
    </div>
  );
};

const defaultContextProps: Omit<TooltipContextProps, 'visible' | 'offset'> = {
  className: 'recomp-tooltip-context',
  classNames: {
    offset: 'offset',
  },
};

Tooltip.Context = Context;

export const useTooltip = () => {
  const [visible, setVisible] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const tooptipNodeRef = React.useRef<React.ReactNode>(null);
  const contentNodeRef = React.useRef<React.ReactNode>(null);

  const handleHover = (hover: boolean, position: { x: number; y: number }) => {
    setVisible(hover);
    setOffset(position);
  };

  const internalHover = useMouseHover({
    onHover: (hover: boolean, position: { x: number; y: number }) => {
      if (hover) {
        tooptipNodeRef.current = contentNodeRef.current;
      }
      handleHover(hover, position);
    },
  });

  return {
    visible,
    offset,
    contextProps: {
      visible,
      offset,
      children: tooptipNodeRef.current,
    },
    hover: handleHover,
    hoverProps: internalHover.itemProps,
    content: (node: React.ReactNode) => {
      console.log('content');
      return (hover: boolean, position: { x: number; y: number }) => {
        console.log('hover: ', hover);
        if (hover) {
          tooptipNodeRef.current = node;
        }
        handleHover(hover, position);
      };
    },
    contentProps: (node: React.ReactNode) => {
      contentNodeRef.current = node;
      return internalHover.itemProps;
    },
  };
};

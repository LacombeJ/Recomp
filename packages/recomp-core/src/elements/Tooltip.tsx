import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

import { animated, useSpring } from '@react-spring/web';

import { Rect, useMouseHover, useSize, useTimeout } from '@recomp/hooks';

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
  props = propUnion(defaultProps, props);
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
  props = propUnion(defaultProps, props);
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
  props = propUnion(defaultProps, props);

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
  props = propUnion(triangleDefaultProps, props);

  const { tipSize, borderSize } = props;

  const className = classnames({
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
  props = propUnion(defaultContextProps, props);

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
      return {
        onMouseMove: (e: React.MouseEvent) => {
          contentNodeRef.current = node;
          internalHover.itemProps.onMouseMove(e);
        },
        onMouseLeave: () => {
          internalHover.itemProps.onMouseLeave();
        },
      };
    },
  };
};

// ----------------------------------------------------------------------------

// Tooltip calculation hooks, for animating tooltips

export const useTooltipCalculations = () => {
  const [tooltipSize, setTooltipSize] = React.useState({ width: 0, height: 0 });
  const handleTooltipSize = (width: number, height: number) => {
    setTooltipSize({ width, height });
  };

  // For opacity animation to finish before making invisible
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [tipActive, setTipActive] = React.useState(false);
  const [tooltip, setTooltip] = React.useState('');
  // if any item was hovered over recently
  const [recentHover, setRecentHover] = React.useState(false);
  const [hoverRect, setHoverRect] = React.useState<Rect>();

  const hoverTimeout = useTimeout(1500);
  const recentTimeout = useTimeout(1000);

  const handleItemClick = (_id: string, _rect: Rect) => {
    setTipActive(false);
    setRecentHover(false);
  };

  const handleItemMouseEnter = (_id: string, tooltip: string, rect: Rect) => {
    setHoverRect(rect);
    hoverTimeout.cancel();

    if (recentHover) {
      setTooltip(tooltip);
      setTipActive(true);
      setTooltipVisible(true);
    } else if (!tipActive) {
      hoverTimeout.begin(() => {
        setTooltip(tooltip);
        setTipActive(true);
        setTooltipVisible(true);
      });
    }

    setRecentHover(true);
    recentTimeout.cancel();
  };

  const handleItemMouseLeave = (_id: string) => {
    hoverTimeout.cancel();
    setTipActive(false);
    recentTimeout.begin(() => {
      setRecentHover(false);
    });
  };

  const expandTip = useSpring({
    width: `${tooltipSize.width}px`,
  });

  let tipY = 0;
  const actualTooltipHight = tooltipSize.height + 5 + 5;
  if (hoverRect) {
    tipY = hoverRect.y + hoverRect.height / 2 - actualTooltipHight / 2;
  }

  let moveConfig = {};
  let moveY = '0px';
  moveConfig = { mass: 1, tension: 1000, friction: 100 };
  moveY = hoverRect ? `${tipY}px` : '0px';

  const moveTip = useSpring({
    config: moveConfig,
    y: moveY,
    opacity: tipActive ? 1 : 0,
    onRest: () => {
      if (tooltipVisible && !tipActive) {
        setTooltipVisible(false);
      }
    },
  });

  return {
    handleTooltipSize,
    tooltip,
    handleItemClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
    expandTip,
    moveTip,
    tooltipVisible,
  };
};

export const calculateParentAnchor = (
  position: 'left' | 'right',
  parentX: number,
  parentWidth: number
) => {
  const style: React.CSSProperties = {};

  if (position === 'left') {
    style.left = `${parentX + parentWidth + 10}px`;
  } else {
    style.right = `${window.innerWidth - parentX + 10}px`;
  }

  return style;
};

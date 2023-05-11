import * as React from 'react';

import * as util from '@recomp/utility/common';

import { useSpring, animated } from '@react-spring/web';

import {
  useMeasure,
  Rect,
  useTimeout,
  useReplaceChildren,
} from '@recomp/hooks';
import { Spacer, Tooltip } from '@recomp/core';

/*
 * Move these notes to a README
 *
 * About the component:
 * An Edge is a bar component that is meant to be placed on the
 * left side of an application. It consists of a tab group that appears
 * on the top of the bar, and a control group that appears on the
 * bottom. Inspired by VSCode.
 *
 * About showing tooltips:
 * - When mouse hovers over an item for some time, tooltip is shown
 * - If mouse moves from one item directly to another, tooltip is shown
 *   - We'll use a small timer for the threshold of "directly"
 * - tooltip opacity will fade in slowly, fade out quickly
 */

interface EdgeProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Edge = (props: EdgeProps) => {
  props = util.structureUnion(defaultProps, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

const defaultProps: EdgeProps = {
  className: 'recomp-edge',
};

// ----------------------------------------------------------------------------

const useTooltipCalculations = () => {
  const parentRef: React.MutableRefObject<HTMLElement> = React.useRef();

  const setParentRef = (element: HTMLElement) => {
    parentRef.current = element;
  };

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

  const hoverTimeout = useTimeout();
  const recentTimeout = useTimeout();

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
      hoverTimeout.begin(1500, () => {
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
    recentTimeout.begin(1000, () => {
      setRecentHover(false);
    });
  };

  let parentYOffset = 0;
  if (parentRef.current) {
    const parentRect = parentRef.current.getBoundingClientRect();
    parentYOffset = parentRect.y;
  }

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
  moveY = hoverRect ? `${tipY - parentYOffset}px` : '0px';

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
    setParentRef,
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

// ----------------------------------------------------------------------------

interface TabsProps {
  className?: string;
  classNames?: {
    hint?: string;
    tooltip?: string;
    tooltipOffset?: string;
    bar?: string;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Tabs = (props: TabsProps) => {
  props = util.structureUnion(tabsDefaultProps, props);
  const { className, style } = props;

  const parentRef: React.MutableRefObject<HTMLElement> = React.useRef();

  const setParentRef = (element: HTMLElement) => {
    parentRef.current = element;
    tooltipCalc.setParentRef(element);
  };

  const [selected, setSelected] = React.useState('');
  const [selectedRect, setSelectedRect] = React.useState<Rect>();

  const tooltipCalc = useTooltipCalculations();

  const handleItemClick = (id: string, rect: Rect) => {
    setSelected(id);
    setSelectedRect(rect);
    tooltipCalc.handleItemClick(id, rect);
  };

  const [replace] = useReplaceChildren<TabProps>((child, childProps) => {
    if (child && child.type && child.type.identifier === Edge.Tab.identifier) {
      childProps = util.structureUnion(tabDefaultProps, childProps);
      return (
        <EdgeItem
          className={childProps.className}
          classNames={childProps.classNames}
          style={childProps.style}
          id={childProps.id}
          tooltip={childProps.tooltip}
          active={childProps.id === selected}
          onClick={handleItemClick}
          onMouseEnter={tooltipCalc.handleItemMouseEnter}
          onMouseLeave={tooltipCalc.handleItemMouseLeave}
        >
          {childProps.children}
        </EdgeItem>
      );
    } else {
      console.error('Expected only Edge.Tab children of Edge.Tabs');
    }
  });

  let parentYOffset = 0;
  if (parentRef.current) {
    const parentRect = parentRef.current.getBoundingClientRect();
    parentYOffset = parentRect.y;
  }

  const moveHint = useSpring({
    config: { mass: 1, tension: 1000, friction: 100 },
    y: selectedRect ? `${selectedRect.y - parentYOffset}px` : '0px',
  });

  return (
    <div className={className} style={style} ref={setParentRef}>
      {selected ? (
        <animated.div
          className={props.classNames.hint}
          style={moveHint}
        ></animated.div>
      ) : null}
      {tooltipCalc.tooltipVisible ? (
        <animated.div
          className={props.classNames.tooltip}
          style={tooltipCalc.moveTip}
        >
          <div className={props.classNames.tooltipOffset}>
            <Tooltip.Animated
              position="right"
              animatedStyle={tooltipCalc.expandTip}
              onResize={tooltipCalc.handleTooltipSize}
            >
              {tooltipCalc.tooltip}
            </Tooltip.Animated>
          </div>
        </animated.div>
      ) : null}
      <div className={props.classNames.bar}>{replace(props.children)}</div>
    </div>
  );
};
Edge.Tabs = Tabs;

const tabsDefaultProps: TabsProps = {
  className: 'tabs',
  classNames: {
    hint: 'hint',
    tooltip: 'tooltip',
    tooltipOffset: 'tooltip-offset',
    bar: 'bar',
  },
};

// ----------------------------------------------------------------------------

interface TabProps {
  className?: string;
  classNames?: {
    active?: string;
  };
  style?: React.CSSProperties;
  id: string;
  tooltip?: string;
  children?: React.ReactNode;
}

const Tab = (props: TabProps) => {
  props = util.structureUnion(tabDefaultProps, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};
Tab.identifier = 'recomp-edge-tab';
Edge.Tab = Tab;

const tabDefaultProps = {
  className: 'tab',
  classNames: {
    active: 'active',
  },
};

// ----------------------------------------------------------------------------

interface ControlsProps {
  className?: string;
  classNames?: {
    tooltip?: string;
    tooltipOffset?: string;
    bar?: string;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Controls = (props: ControlsProps) => {
  props = util.structureUnion(controlsDefaultProps, props);
  const { className, style } = props;

  const tooltipCalc = useTooltipCalculations();

  const [replace] = useReplaceChildren<ControlProps>((child, childProps) => {
    if (
      child &&
      child.type &&
      child.type.identifier === Edge.Control.identifier
    ) {
      childProps = util.structureUnion(controlDefaultProps, childProps);
      return (
        <EdgeItem
          className={childProps.className}
          classNames={childProps.classNames}
          style={childProps.style}
          id={childProps.id}
          tooltip={childProps.tooltip}
          active={false}
          onClick={tooltipCalc.handleItemClick}
          onMouseEnter={tooltipCalc.handleItemMouseEnter}
          onMouseLeave={tooltipCalc.handleItemMouseLeave}
        >
          {childProps.children}
        </EdgeItem>
      );
    } else {
      console.error('Expected only Edge.Control children of Edge.Controls');
    }
  });

  return (
    <div className={className} style={style} ref={tooltipCalc.setParentRef}>
      {tooltipCalc.tooltipVisible ? (
        <animated.div
          className={props.classNames.tooltip}
          style={tooltipCalc.moveTip}
        >
          <div className={props.classNames.tooltipOffset}>
            <Tooltip.Animated
              position="right"
              animatedStyle={tooltipCalc.expandTip}
              onResize={tooltipCalc.handleTooltipSize}
            >
              {tooltipCalc.tooltip}
            </Tooltip.Animated>
          </div>
        </animated.div>
      ) : null}
      <div className={props.classNames.bar}>{replace(props.children)}</div>
    </div>
  );
};
Edge.Controls = Controls;

const controlsDefaultProps: ControlsProps = {
  className: 'controls',
  classNames: {
    tooltip: 'tooltip',
    tooltipOffset: 'tooltip-offset',
    bar: 'bar',
  },
};

// ----------------------------------------------------------------------------

interface ControlProps {
  className?: string;
  classNames?: {
    active?: string;
  };
  id: string;
  tooltip?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Control = (props: ControlProps) => {
  props = util.structureUnion(controlDefaultProps, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};
Control.identifier = 'recomp-edge-control';
Edge.Control = Control;

const controlDefaultProps = {
  className: 'control',
  classNames: {
    active: 'active',
  },
};

// ----------------------------------------------------------------------------

interface EdgeItemProps {
  className?: string;
  classNames?: {
    active?: string;
  };
  style?: React.CSSProperties;
  id?: string;
  tooltip?: string;
  active?: boolean;
  onClick?: (id: string, rect: Rect) => any;
  onMouseEnter?: (id: string, tooltip: string, rect: Rect) => any;
  onMouseLeave?: (id: string) => any;
  children?: React.ReactNode;
}

const EdgeItem = (props: EdgeItemProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.active]: props.active,
  });

  const [divRef, measureResult] = useMeasure();

  const handleClick = () => {
    props.onClick?.(props.id, measureResult.clientRect);
  };

  const handleMouseEnter = () => {
    props.onMouseEnter?.(props.id, props.tooltip, measureResult.clientRect);
  };

  const handleMouseLeave = () => {
    props.onMouseLeave?.(props.id);
  };

  return (
    <div
      className={className}
      style={props.style}
      ref={divRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {props.children}
    </div>
  );
};

// ----------------------------------------------------------------------------

Edge.Spacer = Spacer;

export default Edge;

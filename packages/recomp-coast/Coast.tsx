import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

import { useSpring, animated } from '@react-spring/web';

import {
  useMeasure,
  Rect,
  useChildrenProps,
  useStateOrProps,
  useHandle,
  useHandleChildren,
} from '@recomp/hooks';
import {
  Spacer,
  Tooltip,
  calculateParentAnchor,
  useTooltipCalculations,
} from '@recomp/core';

/*
 * Move these notes to a README
 *
 * About the component:
 * A Coast is a bar component that is meant to be placed on the
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

interface CoastProps {
  className?: string;
  style?: React.CSSProperties;
  position?: Position;
  children?: React.ReactNode;
}

export const Coast = (props: CoastProps) => {
  props = propUnion(defaultProps, props);
  const className = classnames({
    [props.className]: true,
    [props.position]: true,
  });
  const [cloner] = useChildrenProps<any>((child, _childProps) => {
    if (
      child?.type?.identifier === Coast.Tabs.identifier ||
      child?.type?.identifier === Coast.Controls.identifier
    ) {
      return {
        position: props.position,
      };
    }
  });
  return (
    <div className={className} style={props.style}>
      {cloner(props.children)}
    </div>
  );
};

const defaultProps: CoastProps = {
  className: 'recomp-coast',
  position: 'left',
};

// ----------------------------------------------------------------------------

export interface CoastItemHandler {
  handleItemClick?: (id: string, rect: Rect) => any;
  handleItemDoubleClick?: (id: string) => any;
  handleItemMouseEnter?: (id: string, tooltip: string, rect: Rect) => any;
  handleItemMouseLeave?: (id: string) => any;
}

export interface CoastItemEvents {
  onClick: (id: string, rect: Rect) => any;
  onDoubleClick: (id: string) => any;
  onMouseEnter: (id: string, tooltip: string, rect: Rect) => any;
  onMouseLeave: (id: string) => any;
}

export interface CoastItemPassProps extends CoastItemEvents {
  active: boolean;
}

export const useCoastHandler = (): [
  (handler: CoastItemHandler) => any,
  CoastItemHandler
] => {
  const [setHandler, handler] = useHandle<CoastItemHandler>();

  const handleItemClick = (id: string, rect: Rect) => {
    handler.current?.handleItemClick(id, rect);
  };
  const handleItemDoubleClick = (id: string) => {
    handler.current?.handleItemDoubleClick(id);
  };
  const handleItemMouseEnter = (id: string, tooltip: string, rect: Rect) => {
    handler.current?.handleItemMouseEnter(id, tooltip, rect);
  };
  const handleItemMouseLeave = (id: string) => {
    handler.current?.handleItemMouseLeave(id);
  };

  return [
    setHandler,
    {
      handleItemClick,
      handleItemDoubleClick,
      handleItemMouseEnter,
      handleItemMouseLeave,
    },
  ];
};

export const useCoastEvents = (controls: CoastItemHandler): CoastItemEvents => {
  return {
    onClick: controls.handleItemClick,
    onDoubleClick: controls.handleItemDoubleClick,
    onMouseEnter: controls.handleItemMouseEnter,
    onMouseLeave: controls.handleItemMouseLeave,
  };
};

// ----------------------------------------------------------------------------

interface TabsProps {
  className?: string;
  classNames?: {
    hint?: string;
    tooltip?: string;
    tooltipOffset?: string;
    tooltipOverlay?: string;
    bar?: string;
  };
  style?: React.CSSProperties;
  selected?: string;
  defaultSelected?: string;
  position?: Position;
  children?: React.ReactNode;
  onItemClick?: (id: string) => any;
  onDoubleItemClick?: (id: string) => any;
  onItemDoubleClick?: (id: string) => any;
  setHandler?: (handlers: CoastItemHandler) => any;
}

const Tabs = (props: TabsProps) => {
  props = propUnion(tabsDefaultProps, props);
  const { className, style } = props;

  const [parentRef, parentMeasure] = useMeasure();

  const [selected, setSelected] = useStateOrProps(
    props.defaultSelected,
    props.selected
  );

  const [selectedRect, setSelectedRect] = React.useState<Rect>();

  const tooltipCalc = useTooltipCalculations();
  const tooltipAnchor = calculateParentAnchor(
    props.position,
    parentMeasure.clientRect.x,
    parentMeasure.clientRect.width
  );

  const handleItemClick = (id: string, rect: Rect) => {
    setSelected?.(id);
    setSelectedRect(rect);
    tooltipCalc.handleItemClick(id, rect);
    props.onItemClick?.(id);
  };
  const handleItemDoubleClick = (id: string) => {
    props.onItemDoubleClick?.(id);
  };
  const handleItemMouseEnter = (id: string, tooltip: string, rect: Rect) => {
    tooltipCalc.handleItemMouseEnter(id, tooltip, rect);
  };
  const handleItemMouseLeave = (id: string) => {
    tooltipCalc.handleItemMouseLeave(id);
  };

  props.setHandler?.({
    handleItemClick,
    handleItemDoubleClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
  });

  const [handleChildren] = useHandleChildren<
    CoastItemProps,
    CoastItemPassProps
  >(Coast.Tab.identifier, (props) => ({
    onClick: handleItemClick,
    onDoubleClick: handleItemDoubleClick,
    onMouseEnter: handleItemMouseEnter,
    onMouseLeave: handleItemMouseLeave,
    active: props.id === selected,
  }));

  const moveHint = useSpring({
    config: { mass: 1, tension: 1000, friction: 100 },
    y: selectedRect
      ? `${selectedRect.y - parentMeasure.clientRect.y}px`
      : '0px',
  });

  const tooltipStyle: any = {
    ...tooltipCalc.moveTip,
    ...tooltipAnchor,
  };

  return (
    <div className={className} style={style} ref={parentRef}>
      {selected ? (
        <animated.div
          className={props.classNames.hint}
          style={moveHint}
        ></animated.div>
      ) : null}
      <div className={props.classNames.tooltipOverlay}>
        {tooltipCalc.tooltipVisible ? (
          <animated.div
            className={props.classNames.tooltip}
            style={tooltipStyle}
          >
            <div className={props.classNames.tooltipOffset}>
              <Tooltip.Animated
                position={tooltipPosition(props.position)}
                animatedStyle={tooltipCalc.expandTip}
                onResize={tooltipCalc.handleTooltipSize}
              >
                {tooltipCalc.tooltip}
              </Tooltip.Animated>
            </div>
          </animated.div>
        ) : null}
      </div>
      <div className={props.classNames.bar}>
        {handleChildren(props.children)}
      </div>
    </div>
  );
};
Tabs.identifier = 'recomp-coast-tabs';
Coast.Tabs = Tabs;

const tabsDefaultProps: TabsProps = {
  className: 'tabs',
  classNames: {
    hint: 'hint',
    tooltip: 'tooltip',
    tooltipOffset: 'tooltip-offset',
    tooltipOverlay: 'tooltip-overlay',
    bar: 'bar',
  },
  defaultSelected: '',
};

// ----------------------------------------------------------------------------

interface ControlsProps {
  className?: string;
  classNames?: {
    tooltip?: string;
    tooltipOffset?: string;
    tooltipOverlay?: string;
    bar?: string;
  };
  style?: React.CSSProperties;
  position?: Position;
  children?: React.ReactNode;
  onItemClick?: (id: string) => any;
  onItemDoubleClick?: (id: string) => any;
  setHandler?: (handlers: CoastItemHandler) => any;
}

const Controls = (props: ControlsProps) => {
  props = propUnion(controlsDefaultProps, props);
  const { className, style } = props;

  const [parentRef, parentMeasure] = useMeasure();

  const tooltipCalc = useTooltipCalculations();
  const tooltipAnchor = calculateParentAnchor(
    props.position,
    parentMeasure.clientRect.x,
    parentMeasure.clientRect.width
  );

  const handleItemClick = (id: string, rect: Rect) => {
    tooltipCalc.handleItemClick(id, rect);
    props.onItemClick?.(id);
  };
  const handleItemDoubleClick = (id: string) => {
    props.onItemDoubleClick?.(id);
  };
  const handleItemMouseEnter = (id: string, tooltip: string, rect: Rect) => {
    tooltipCalc.handleItemMouseEnter(id, tooltip, rect);
  };
  const handleItemMouseLeave = (id: string) => {
    tooltipCalc.handleItemMouseLeave(id);
  };

  props.setHandler?.({
    handleItemClick,
    handleItemDoubleClick,
    handleItemMouseEnter,
    handleItemMouseLeave,
  });

  const [handleChildren] = useHandleChildren<
    CoastItemProps,
    CoastItemPassProps
  >(Coast.Control.identifier, () => ({
    onClick: handleItemClick,
    onDoubleClick: handleItemDoubleClick,
    onMouseEnter: handleItemMouseEnter,
    onMouseLeave: handleItemMouseLeave,
    active: false,
  }));

  const tooltipStyle: any = {
    ...tooltipCalc.moveTip,
    ...tooltipAnchor,
  };

  return (
    <div className={className} style={style} ref={parentRef}>
      <div className={props.classNames.tooltipOverlay}>
        {tooltipCalc.tooltipVisible ? (
          <animated.div
            className={props.classNames.tooltip}
            style={tooltipStyle}
          >
            <div className={props.classNames.tooltipOffset}>
              <Tooltip.Animated
                position={tooltipPosition(props.position)}
                animatedStyle={tooltipCalc.expandTip}
                onResize={tooltipCalc.handleTooltipSize}
              >
                {tooltipCalc.tooltip}
              </Tooltip.Animated>
            </div>
          </animated.div>
        ) : null}
      </div>
      <div className={props.classNames.bar}>
        {handleChildren(props.children)}
      </div>
    </div>
  );
};
Controls.identifier = 'recomp-coast-controls';
Coast.Controls = Controls;

const controlsDefaultProps: ControlsProps = {
  className: 'controls',
  classNames: {
    tooltip: 'tooltip',
    tooltipOffset: 'tooltip-offset',
    tooltipOverlay: 'tooltip-overlay',
    bar: 'bar',
  },
};

// ----------------------------------------------------------------------------

interface CoastItemProps {
  className?: string;
  classNames?: {
    active?: string;
  };
  style?: React.CSSProperties;
  id?: string;
  tooltip?: string;
  active?: boolean;
  onClick?: (id: string, rect: Rect) => any;
  onDoubleClick?: (id: string) => any;
  onMouseEnter?: (id: string, tooltip: string, rect: Rect) => any;
  onMouseLeave?: (id: string) => any;
  children?: React.ReactNode;
}

const CoastItem = (props: CoastItemProps) => {
  const className = classnames({
    [props.className]: true,
    [props.classNames.active]: props.active,
  });

  const [divRef, measureResult] = useMeasure();

  const handleClick = () => {
    props.onClick?.(props.id, measureResult.clientRect);
  };

  const handleDoubleClick = () => {
    props.onDoubleClick?.(props.id);
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
      onDoubleClick={handleDoubleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {props.children}
    </div>
  );
};

// ----------------------------------------------------------------------------

const Tab = (props: CoastItemProps) => {
  props = propUnion(tabDefaultProps, props);
  return <CoastItem {...props}></CoastItem>;
};
Tab.identifier = 'recomp-coast-tab';
Coast.Tab = Tab;

const tabDefaultProps = {
  className: 'tab',
  classNames: {
    active: 'active',
  },
};

// ----------------------------------------------------------------------------

const Control = (props: CoastItemProps) => {
  props = propUnion(controlDefaultProps, props);
  return <CoastItem {...props}></CoastItem>;
};
Control.identifier = 'recomp-coast-control';
Coast.Control = Control;

const controlDefaultProps = {
  className: 'control',
  classNames: {
    active: 'active',
  },
};

// ----------------------------------------------------------------------------

Coast.Spacer = Spacer;

// ----------------------------------------------------------------------------

type Position = 'left' | 'right';

const tooltipPosition = (position: Position): Position => {
  if (position === 'left') {
    return 'right';
  } else {
    return 'left';
  }
};

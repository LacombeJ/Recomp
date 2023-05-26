import * as React from 'react';

import * as util from '@recomp/utility/common';

import { useSpring, animated } from '@react-spring/web';

import { Collapse, Expand } from '@recomp/icons';
import { useHover, useMeasure, useModel, Update } from '@recomp/hooks';

interface CabinetProps {
  children?: React.ReactNode;
  className?: string;
  classNames?: {
    head?: string;
    control?: string;
    icon?: string;
    label?: string;
    title?: string;
    subtitle?: string;
    body?: string;
    hover?: string;
  };
  style?: React.CSSProperties;
  defaultExpanded?: boolean;
  expanded?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  controlIcon?: (expanded: boolean) => any;
  onExpanded?: Update<boolean>;
}

export const Cabinet = (props: CabinetProps) => {
  props = util.structureUnion(defaultProps, props);

  const { style } = props;

  const [hover, handleMouseEnter, handleMouseLeave] = useHover(false);

  const [expanded, setExpanded] = useModel(
    props.defaultExpanded,
    props.expanded,
    props.onExpanded
  );

  // Using this because of react spring. We'll wait until animation finishes
  // before making invisible again
  const [visible, setVisible] = React.useState(expanded);

  const [bodyRef, { contentRect }] = useMeasure();
  const { height } = contentRect;

  // added margins for correct height, not sure why this is needed
  const actualHeight = height + 8 + 8 + 4 + 4;
  const expand = useSpring({
    height: expanded ? `${actualHeight}px` : '0px',
  });
  const spin = useSpring({
    onRest: () => {
      // If rested, is visible, and no longer expanded, make invisible
      if (visible && !expanded) {
        setVisible(false);
      }
    },
    transform: expanded ? `rotate(90deg)` : 'rotate(0deg)',
  });

  const classNames = props.classNames;

  const className = util.classnames({
    [props.className]: true,
    expanded,
    hover,
  });

  const handleClick = () => {
    // Toggle expanded
    setExpanded((expanded) => !expanded);

    // If element isn't expanded, toggle visibility
    if (!expanded) {
      setVisible(true);
    }
  };

  return (
    <div className={className} style={style}>
      <div
        className={classNames.head}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className={classNames.icon}>{props.icon}</span>
        <div className={classNames.label}>
          <span className={classNames.title}>{props.title}</span>
          <span className={classNames.subtitle}>{props.subtitle}</span>
        </div>
        <animated.span className={classNames.control} style={spin}>
          {props.controlIcon(false)}
        </animated.span>
      </div>
      {visible ? (
        <animated.div style={{ ...expand, overflow: 'hidden' }}>
          <div ref={bodyRef} className={classNames.body}>
            {props.children}
          </div>
        </animated.div>
      ) : null}
    </div>
  );
};

const controlIconCallback = (expanded: boolean) => {
  if (expanded) {
    return <Collapse></Collapse>;
  } else {
    return <Expand></Expand>;
  }
};

const defaultProps: CabinetProps = {
  className: 'recomp-cabinet',
  classNames: {
    head: 'head',
    control: 'control',
    icon: 'icon',
    label: 'label',
    title: 'title',
    subtitle: 'subtitle',
    body: 'body',
  },
  controlIcon: controlIconCallback,
  onExpanded: () => {},
};

import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

import { useSpring, animated } from '@react-spring/web';

import { Collapse, Expand } from '@recomp/icons';
import { useMouseInside, useMeasure } from '@recomp/hooks';

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
  expanded?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  controlIcon?: (expanded: boolean) => React.ReactNode;
  onExpanded?: (expanded: boolean) => void;
}

export const Cabinet = (props: CabinetProps) => {
  props = propUnion(defaultProps, props);

  const { style } = props;

  const { inside, props: insideProps } = useMouseInside(false);

  // Using this because of react spring. We'll wait until animation finishes
  // before making invisible again
  const [visible, setVisible] = React.useState(props.expanded);

  const [bodyRef, { contentRect }] = useMeasure();
  const { height } = contentRect;

  // added margins for correct height, not sure why this is needed
  const actualHeight = height + 8 + 8 + 4 + 4;
  const expand = useSpring({
    height: props.expanded ? `${actualHeight}px` : '0px',
  });
  const spin = useSpring({
    onRest: () => {
      // If rested, is visible, and no longer expanded, make invisible
      if (visible && !props.expanded) {
        setVisible(false);
      }
    },
    transform: props.expanded ? `rotate(90deg)` : 'rotate(0deg)',
  });

  const classNames = props.classNames;

  const className = classnames({
    [props.className]: true,
    expanded: props.expanded,
    hover: inside,
  });

  const handleClick = () => {
    // Toggle expanded
    props.onExpanded(!props.expanded);

    // If element isn't expanded, toggle visibility
    if (!props.expanded) {
      setVisible(true);
    }
  };

  return (
    <div className={className} style={style}>
      <div className={classNames.head} onClick={handleClick} {...insideProps}>
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

// ----------------------------------------------------------------------------

export const useCabinetState = (defaultExpanded: boolean = false) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);

  const onExpanded = (expanded: boolean) => {
    setExpanded(expanded);
  };

  return {
    expanded,
    props: {
      expanded,
      onExpanded,
    },
  };
};

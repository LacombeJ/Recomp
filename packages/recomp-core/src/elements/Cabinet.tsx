import * as React from 'react';

import * as util from '@recomp/utility/common';

import { Collapse, Expand } from '@recomp/icons';
import { useStateOrProps, useHover } from '@recomp/hooks';

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
  onCollapse?: () => any;
}

const Cabinet = (props: CabinetProps) => {
  props = util.structureUnion(defaultProps, props);

  const { style } = props;

  const [hover, handleMouseEnter, handleMouseLeave] = useHover(false);

  const [expanded, setExpanded] = useStateOrProps(
    props.defaultExpanded,
    props.expanded,
    props.onCollapse
  );

  const classNames = props.classNames;

  const className = util.classnames({
    [props.className]: true,
    expanded,
    hover,
  });

  const handleClick = () => {
    setExpanded(!expanded);
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
        <span className={classNames.control}>
          {props.controlIcon(expanded)}
        </span>
      </div>
      {expanded ? (
        <div className={classNames.body}>{props.children}</div>
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
  onCollapse: () => {},
};

export default Cabinet;

import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

interface BarProps {
  className?: string;
  classNames?: {
    start?: string;
    center?: string;
    end?: string;
  };
  style?: React.CSSProperties;
  direction: 'vertical' | 'horizontal';
  children?: React.ReactNode;
}

export const Bar = (props: BarProps) => {
  props = propUnion(defaultProps, props);
  const { classNames, style } = props;

  const className = classnames({
    [props.className]: true,
    vertical: props.direction === 'vertical',
    horizontal: props.direction === 'horizontal',
  });

  return (
    <div className={className} style={style}>
      {mapChildren(props.children, classNames)}
    </div>
  );
};

const mapChildren = (children: any, classNames: any) => {
  children = React.Children.toArray(children); // make as array so we can map
  return React.Children.map(children, (child, i) => {
    const className = classnames({
      [classNames.start]: i === 0 && i !== children.length - 1,
      [classNames.center]: !((i === 0) !== (i === children.length - 1)),
      [classNames.end]: i !== 0 && i === children.length - 1,
    });
    return <span className={className}>{child}</span>;
  });
};

const defaultProps: BarProps = {
  className: 'recomp-bar',
  classNames: {
    start: 'start',
    center: 'center',
    end: 'end',
  },
  direction: 'horizontal',
};

import * as React from 'react';

import { propUnion } from '@recomp/props';

interface NestProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  collapsed?: boolean;
  stopPropagation?: boolean;
  onToggle?: (event: { id: string; collapsed: boolean }) => any;
  children?: React.ReactNode;
}

export const Nest = (props: NestProps) => {
  props = propUnion(defaultProps, props);
  const { className, style } = props;

  const handleClick = (e: React.MouseEvent) => {
    if (props.stopPropagation) {
      e.stopPropagation();
    }
    props.onToggle({
      id: props.id,
      collapsed: props.collapsed,
    });
  };

  const children = React.Children.toArray(props.children);
  const head = children.slice(0, 1); // first
  const tail = children.slice(1); // rest
  return (
    <div className={className} style={style} onClick={handleClick}>
      {head}
      {props.collapsed ? null : tail}
    </div>
  );
};

const defaultProps = {
  className: 'recomp-nest',
  collapsed: true,
  stopPropagation: true,
  onToggle: () => {},
};

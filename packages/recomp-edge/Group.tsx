import * as React from 'react';

import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import * as util from '@recomp/utility/common';

interface EdgeGroupProps {
  className?: string;
  classNames?: {
    dragging?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  dragging: boolean;
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  children?: React.ReactNode;
  divRef?: React.LegacyRef<HTMLDivElement>;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap;
}

// Modeling group after the "Cabinet" component
// a folder that can contain additonal atabs
export const EdgeGroup = (props: EdgeGroupProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: props.dragging,
  });
  const headStyle: React.CSSProperties = {
    backgroundColor: props.color,
  };
  const handleClick = () => {
    // props.onClick?.(props.id);
  };
  return (
    <div
      className={className}
      style={props.style}
      ref={props.divRef}
      {...props.attributes}
      {...props.listeners}
    >
      <div className="head" style={headStyle} onClick={handleClick}>
        <div className={props.classNames.icon}>{props.icon}</div>
        <div className={props.classNames.label}>{props.id}</div>
      </div>
      <div className="body">Body</div>
    </div>
  );
};

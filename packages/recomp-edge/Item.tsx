import * as React from 'react';

import { DraggableAttributes } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import * as util from '@recomp/utility/common';

interface EdgeItemProps {
  className?: string;
  classNames?: {
    dragging?: string;
    selected?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  dragging: boolean;
  selected: boolean;
  icon?: React.ReactNode;
  onClick?: (id: string) => any;
  children?: React.ReactNode;
  divRef?: React.LegacyRef<HTMLDivElement>;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap;
}

export const EdgeItem = (props: EdgeItemProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: props.dragging,
    [props.classNames.selected]: props.selected,
  });
  const handleClick = () => {
    props.onClick?.(props.id);
  };
  return (
    <div
      className={className}
      style={props.style}
      ref={props.divRef}
      {...props.attributes}
      {...props.listeners}
      onClick={handleClick}
    >
      <div className={props.classNames.icon}>{props.icon}</div>
      <div className={props.classNames.label}>{props.children}</div>
    </div>
  );
};

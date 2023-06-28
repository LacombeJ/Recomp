import * as React from 'react';

import * as util from '@recomp/utility/common';
import { Close } from '@recomp/icons';
import { Rect } from '@recomp/hooks';

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
  dragging: string;
  selected: string;
  invisible: boolean;
  icon?: React.ReactNode;
  onClick: (id: string, rect: Rect) => any;
  onDoubleClick: (id: string) => any;
  onCloseClick: (id: string) => any;
  onContextMenu: (e: React.MouseEvent, id: string) => any;
  onMouseEnter?: (id: string, rect: Rect) => any;
  onMouseLeave?: (id: string) => any;
  children?: React.ReactNode;
}

export const EdgeItem = (props: EdgeItemProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: props.dragging === props.id,
    [props.classNames.selected]: props.selected === props.id,
  });

  const style: React.CSSProperties = {
    ...props.style,
  };

  if (props.invisible) {
    style.visibility = 'hidden';
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    props.onClick(props.id, rect);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    props.onContextMenu(e, props.id);
  };

  const handleEventStop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    props.onCloseClick(props.id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    props.onMouseEnter?.(props.id, rect);
  };

  const handleMouseLeave = () => {
    props.onMouseLeave?.(props.id);
  };

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
      onDoubleClick={() => props.onDoubleClick?.(props.id)}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={props.classNames.icon}>{props.icon}</div>
      <div className={props.classNames.label}>{props.children}</div>
      <div className="close-container">
        <div
          className={'close'}
          onPointerDown={handleEventStop}
          onMouseDown={handleEventStop}
          onClick={handleClose}
        >
          <Close></Close>
        </div>
      </div>
    </div>
  );
};

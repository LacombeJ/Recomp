import * as React from 'react';

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
  dragging?: string;
  selected?: string;
  invisible: boolean;
  icon?: React.ReactNode;
  onClick?: (id: string) => any;
  children?: React.ReactNode;
  divRef?: React.LegacyRef<HTMLDivElement>;
}

export const EdgeItem = (props: EdgeItemProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: props.dragging === props.id,
    [props.classNames.selected]: props.selected === props.id,
  });
  const style: React.CSSProperties = {
    ...props.style,
  }
  if (props.invisible) {
    style.visibility = 'hidden';
  }
  const handleClick = () => {
    props.onClick?.(props.id);
  };
  return (
    <div
      className={className}
      style={style}
      ref={props.divRef}
      onClick={handleClick}
    >
      <div className={props.classNames.icon}>{props.icon}</div>
      <div className={props.classNames.label}>{props.children}</div>
    </div>
  );
};

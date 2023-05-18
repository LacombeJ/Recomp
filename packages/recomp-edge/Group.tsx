import * as React from 'react';

import { DraggableAttributes } from '@dnd-kit/core';

import {
  verticalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import * as util from '@recomp/utility/common';
import { TabItem, elementChildren, mapTabElements } from './common';

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
  invisible: boolean;
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  tabItems?: TabItem[];
  divRef?: React.LegacyRef<HTMLDivElement>;
}

// Modeling group after the "Cabinet" component
// a folder that can contain additonal atabs
export const EdgeGroup = (props: EdgeGroupProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: props.dragging,
  });
  const style: React.CSSProperties = {
    ...props.style,
  };
  if (props.invisible) {
    style.visibility = 'hidden';
  }
  // const { mapppedElements, orderedIds } = mapTabElements(props.tabItems);
  // const [items, setItems] = React.useState(orderedIds);
  const items = props.tabItems;

  const headStyle: React.CSSProperties = {
    backgroundColor: props.color,
  };
  const bodyStyle: React.CSSProperties = {
    border: `1px solid ${props.color}`,
  };
  const handleClick = () => {
    // props.onClick?.(props.id);
  };
  const handleItemClick = (id: string) => {
    // setSelected(id);
  };
  return (
    <div className={className} style={style} ref={props.divRef}>
      <div className="head" style={headStyle} onClick={handleClick}>
        <div className={props.classNames.icon}>{props.icon}</div>
        <div className={props.classNames.label}>{props.id}</div>
      </div>
      <div className="body" style={bodyStyle}>
        <div className="inner">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((element) => {
              // const element = mapppedElements[id];
              return null;
              // return (
              //   <SortableItem
              //     className={element.className}
              //     classNames={element.classNames}
              //     style={element.style}
              //     key={element.id}
              //     id={element.id}
              //     type={element.type}
              //     dragging={false}
              //     selected={false}
              //     icon={element.icon}
              //     color={element.color}
              //     onClick={handleItemClick}
              //     children={elementChildren(element)}
              //   />
              // );
            })}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

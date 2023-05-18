import * as React from 'react';

import { DraggableAttributes } from '@dnd-kit/core';

import {
  verticalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';

import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import * as util from '@recomp/utility/common';
import { TabItem, TabTree, elementChildren } from './common';
import { EdgeElement } from './Edge';
import { Sortable } from './Sortable';

interface EdgeGroupProps {
  className?: string;
  classNames?: {
    dragging?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  dragging?: string;
  selected?: string;
  invisible: boolean;
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  tabItems?: string[];
  tree?: TabTree;
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
            {items.map((id) => {
              const node = props.tree.state.byId[id];
              const element = props.tree.static[id];
              // return null;
              return (
                <Sortable
                  className={'sortable'}
                  key={node.id}
                  id={node.id}
                >
                  <EdgeElement
                    className={element.className}
                    classNames={element.classNames}
                    style={element.style}
                    id={node.id}
                    type={element.type}
                    dragging={props.dragging}
                    selected={props.selected}
                    invisible={props.dragging === node.id}
                    icon={element.icon}
                    color={element.color}
                    onClick={handleItemClick}
                    children={elementChildren(element)}
                    tabItems={node.children}
                  />
                </Sortable>
              );
            })}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};

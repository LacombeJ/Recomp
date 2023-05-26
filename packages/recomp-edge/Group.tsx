import * as React from 'react';

import {
  verticalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useSpring, animated } from '@react-spring/web';
import { useMeasure } from '@recomp/hooks';

import * as util from '@recomp/utility/common';

import { TabTree, elementChildren } from './common';
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
  expanded: boolean;
  invisible: boolean;
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  tabItems?: string[];
  tree?: TabTree;
  divRef?: React.LegacyRef<HTMLDivElement>;
  handleRef?: React.LegacyRef<HTMLDivElement>;
  handleListeners?: SyntheticListenerMap;
}

// Modeling group after the "Cabinet" component
// a folder that can contain additonal atabs
export const EdgeGroup = (props: EdgeGroupProps) => {
  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: props.dragging,
    expanded: props.expanded,
  });

  const style: React.CSSProperties = {
    ...props.style,
  };

  const [bodyVisible, setBodyVisible] = React.useState(props.expanded);

  if (props.invisible) {
    style.visibility = 'hidden';
  }

  const [bodyRef, { contentRect }] = useMeasure();
  const { height } = contentRect;
  const actualHeight = height + 6 + 4 + 6;
  const expand = useSpring({
    height: props.expanded ? `${actualHeight}px` : '0px',
    onRest: () => {
      // If rested, is visible, and no longer expanded, make invisible
      if (bodyVisible && !props.expanded) {
        setBodyVisible(false);
      }
    },
  });

  const items = props.tabItems;

  const headStyle: React.CSSProperties = {
    backgroundColor: props.color,
  };

  const bodyStyle: React.CSSProperties = {
    border: `1px solid ${props.color}`,
  };

  const handeHeadClick = () => {
    props.onClick?.(props.id);
    if (!props.expanded) {
      setBodyVisible(true);
    }
  };

  const handleItemClick = (id: string) => {
    props.onClick?.(id);
  };

  return (
    <div className={className} style={style} ref={props.divRef}>
      <div
        className="head"
        style={headStyle}
        onClick={handeHeadClick}
        ref={props.handleRef}
        {...props.handleListeners}
      >
        <div className={props.classNames.icon}>{props.icon}</div>
        <div className={props.classNames.label}>{props.id}</div>
      </div>
      <div className="body" style={bodyStyle}>
        {bodyVisible ? (
          <animated.div style={{ ...expand, overflow: 'hidden' }}>
            <div className="inner" ref={bodyRef}>
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((id) => {
                  const node = props.tree.state.byId[id];
                  const element = props.tree.static[id];
                  return (
                    <Sortable className={'sortable'} key={node.id} id={node.id}>
                      <EdgeElement
                        className={element.className}
                        classNames={element.classNames}
                        style={element.style}
                        id={node.id}
                        type={element.type}
                        dragging={props.dragging}
                        selected={props.selected}
                        expanded={false}
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
          </animated.div>
        ) : null}
      </div>
    </div>
  );
};

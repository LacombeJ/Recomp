import * as React from 'react';

import {
  verticalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useSpring, animated } from '@react-spring/web';
import { Rect, useMeasure } from '@recomp/hooks';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

// import { TabTree, elementChildren } from './common';
import { Sortable } from './Sortable';
import {
  EdgeModel,
  EdgeTabGroup,
  GroupProps,
  TabProps,
  tabDefaultProps,
} from './Edge';
import { EdgeItem } from './Item';

interface EdgeGroupProps extends GroupProps {
  id: string;
  dragging: string;
  selected: string;
  expanded: boolean;
  invisible: boolean;
  animated: boolean;
  onItemClick: (id: string, rect: Rect) => any;
  onItemDoubleClick: (id: string) => any;
  onItemClose: (id: string) => any;
  onGroupClick: (id: string, rect: Rect) => any;
  onItemContextMenu: (e: React.MouseEvent, id: string) => any;
  onGroupContextMenu: (e: React.MouseEvent, id: string) => any;
  onRenderItem: (id: string) => TabProps;
  onMouseEnter?: (id: string, rect: Rect) => any;
  onMouseLeave?: (id: string) => any;
  model: EdgeModel;
  handleRef?: (element: HTMLDivElement) => void;
  handleListeners?: SyntheticListenerMap;
}

// Modeling group after the "Cabinet" component
// a folder that can contain additonal atabs
export const EdgeGroup = (props: EdgeGroupProps) => {
  const className = classnames({
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
  const actualHeight = height + 6 + 6;

  let expand: any = useSpring({
    height: props.expanded || !props.animated ? `${actualHeight}px` : '0px',
    onRest: () => {
      // If rested, is visible, and no longer expanded, make invisible
      if (bodyVisible && !props.expanded) {
        setBodyVisible(false);
      }
    },
  });

  if (!props.animated) {
    expand = {};
  }

  const items = (props.model.byId[props.id] as EdgeTabGroup).items;

  const headStyle: React.CSSProperties = {
    backgroundColor: props.color,
  };

  const bodyStyle: React.CSSProperties = {
    border: `1px solid ${props.color}`,
  };

  const handleHeadRef = (element: HTMLDivElement) => {
    props.handleRef?.(element);
  };

  const handeHeadClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    props.onGroupClick?.(props.id, rect);
    if (!props.expanded) {
      setBodyVisible(true);
    }
  };

  const handleHeadMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    props.onMouseEnter?.(props.id, rect);
  };

  const handleHeadMouseLeave = () => {
    props.onMouseLeave?.(props.id);
  };

  React.useEffect(() => {
    // expansion might be triggerd externally, not necessarily through head click
    if (props.expanded) {
      setBodyVisible(true);
    }
  }, [props.expanded]);

  const handleItemClick = (id: string, rect: Rect) => {
    props.onItemClick?.(id, rect);
  };

  const handleItemCloseClick = (id: string) => {
    props.onItemClose?.(id);
  };

  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    props.onItemContextMenu?.(e, id);
  };

  const handleGroupContextMenu = (e: React.MouseEvent) => {
    props.onGroupContextMenu?.(e, props.id);
  };

  const handleMouseEnter = (id: string, rect: Rect) => {
    props.onMouseEnter?.(id, rect);
  };

  const handleMouseLeave = (id: string) => {
    props.onMouseLeave?.(id);
  };

  const group = () => {
    return (
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {items.map((id) => {
          const itemProps = propUnion(
            tabDefaultProps,
            props.onRenderItem(id)
          );
          return (
            <Sortable className={'sortable'} key={id} id={id}>
              <EdgeItem
                id={id}
                dragging={props.dragging}
                selected={props.selected}
                invisible={props.dragging === id}
                onClick={handleItemClick}
                onDoubleClick={props.onItemDoubleClick}
                onCloseClick={handleItemCloseClick}
                onContextMenu={handleItemContextMenu}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                {...itemProps}
              />
            </Sortable>
          );
        })}
      </SortableContext>
    );
  };

  return (
    <div className={className} style={style}>
      <div
        className="head"
        style={headStyle}
        onClick={handeHeadClick}
        onContextMenu={handleGroupContextMenu}
        ref={handleHeadRef}
        onMouseEnter={handleHeadMouseEnter}
        onMouseLeave={handleHeadMouseLeave}
        {...props.handleListeners}
      >
        <div className={props.classNames.icon}>{props.icon}</div>
        <div className={props.classNames.label}>{props.children}</div>
      </div>
      <div className="body" style={bodyStyle}>
        {bodyVisible ? (
          props.animated ? (
            <animated.div style={{ ...expand, overflow: 'hidden' }}>
              <div className="inner" ref={bodyRef}>
                {group()}
              </div>
            </animated.div>
          ) : (
            <div>
              <div className="inner" ref={bodyRef}>
                {group()}
              </div>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
};
EdgeGroup.identifier = 'recomp-edge-group';

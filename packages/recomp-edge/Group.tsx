import * as React from 'react';

import {
  verticalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

import { useSpring, animated } from '@react-spring/web';
import { useMeasure } from '@recomp/hooks';

import * as util from '@recomp/utility/common';

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
  onItemClick: (id: string) => any;
  onGroupClick: (id: string) => any;
  onRenderItem: (id: string) => TabProps;
  model: EdgeModel;
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

  const items = (props.model.byId[props.id] as EdgeTabGroup).items;

  const headStyle: React.CSSProperties = {
    backgroundColor: props.color,
  };

  const bodyStyle: React.CSSProperties = {
    border: `1px solid ${props.color}`,
  };

  const handeHeadClick = () => {
    props.onGroupClick?.(props.id);
    if (!props.expanded) {
      setBodyVisible(true);
    }
  };

  const handleItemClick = (id: string) => {
    props.onItemClick?.(id);
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
                  const itemProps = util.structureUnion(
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
                        {...itemProps}
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
EdgeGroup.identifier = 'recomp-edge-group';

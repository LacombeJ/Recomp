import * as React from 'react';

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragMoveEvent,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  UniqueIdentifier,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToFirstScrollableAncestor,
} from '@dnd-kit/modifiers';

import * as util from '@recomp/utility/common';

import { Chevron, File } from '@recomp/icons';

import {
  mapTabElements,
  elementChildren,
  elementTabItems,
  isGroup,
  TabItemType,
  TabItem,
  TabElement,
} from './common';
import { EdgeItem } from './Item';
import { EdgeGroup } from './Group';
import { Sortable } from './Sortable';
import { closestAdjustedCenter } from './collision';

// ----------------------------------------------------------------------------

interface EdgeProps {
  className?: string;
  classNames?: {
    scrollable?: string;
    dragging?: string;
  };
  style?: React.CSSProperties;
  debug?: boolean;
  children?: React.ReactNode;
}

const Edge = (props: EdgeProps) => {
  props = util.structureUnion(defaultProps, props);

  const [selected, setSelected] = React.useState('');

  const { mapppedElements, orderedIds } = mapTabElements(props.children);
  const [items, setItems] = React.useState(orderedIds);
  const [dragging, setDragging] = React.useState<string | null>(null);

  const lastOverId = React.useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = React.useRef(false);

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: dragging !== null,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const collisionDetectionStrategy: CollisionDetection = React.useCallback(
    (args) => {
      const draggingElement = mapppedElements[dragging];
      if (draggingElement && draggingElement.type === 'group') {
        return closestAdjustedCenter({
          ...args,
        });
      }
      // Start by finding any intersecting droppable
      const pointerInteractions = pointerWithin(args);
      const intersections =
        pointerInteractions.length > 0
          ? pointerInteractions
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId !== null) {
        if (overId in orderedIds) {
          const element = mapppedElements[overId];
          if (isGroup(element)) {
            const containerItems = element.children;
            overId = closestAdjustedCenter({
              ...args,
              droppableContainers: args.droppableContainers.filter(
                (container) =>
                  container.id !== overId &&
                  containerItems.find((e) => e.id === container.id)
              ),
            })[0]?.id;
          }
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = dragging;
      }

      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [dragging, props.children]
  );

  const handleDragStart = (event: DragMoveEvent) => {
    if (event.active) {
      setDragging(event.active.id as string);
    }
  };

  const handleDragEnd = (event: DragMoveEvent) => {
    const { active, over } = event;

    setDragging(null);
    if (active.id !== over.id) {
      setItems((items: string[]) => {
        const oldIndex = items.findIndex((id) => id === active.id);
        const newIndex = items.findIndex((id) => id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleItemClick = (id: string) => {
    setSelected(id);
  };

  const renderElement = (element: TabElement, visible: boolean) => {
    return (
      <EdgeElement
        className={element.className}
        classNames={element.classNames}
        style={element.style}
        id={element.id}
        type={element.type}
        dragging={dragging === element.id}
        selected={selected === element.id}
        invisible={!visible}
        icon={element.icon}
        color={element.color}
        onClick={handleItemClick}
        children={elementChildren(element)}
        tabItems={elementTabItems(element)}
      />
    );
  };

  return (
    <div className={className}>
      <div className={props.classNames.scrollable}>
        <DndContext
          sensors={sensors}
          collisionDetection={collisionDetectionStrategy}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToFirstScrollableAncestor,
          ]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {items.map((id) => {
              const element = mapppedElements[id];
              return (
                <Sortable
                  className={'sortable'}
                  key={element.id}
                  id={element.id}
                >
                  {renderElement(element, dragging !== element.id)}
                </Sortable>
              );
            })}
          </SortableContext>
          <DragOverlay>
            {dragging ? renderElement(mapppedElements[dragging], true) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

const defaultProps: EdgeProps = {
  className: 'recomp-edge',
  classNames: {
    scrollable: 'scrollable',
    dragging: 'dragging',
  },
};

// ----------------------------------------------------------------------------

export interface TabProps {
  className?: string;
  classNames?: {
    dragging?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Tab = (_props: TabProps) => {
  // Tab is a pseudo element, replaced not rendered
  return <React.Fragment />;
};
Tab.identifier = 'recomp-edge-tab';

export const tabDefaultProps = {
  className: 'tab item',
  classNames: {
    dragging: 'dragging',
    selected: 'selected',
    icon: 'icon',
    label: 'label',
  },
  icon: <File></File>,
};

// ----------------------------------------------------------------------------

export interface GroupProps {
  className?: string;
  classNames?: {
    dragging?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  color?: string;
}

const Group = (_props: GroupProps) => {
  return <React.Fragment />;
};
Group.identifier = 'recomp-edge-group';

export const groupDefaultProps = {
  className: 'tab group',
  color: '#1d5e7c',
  classNames: {
    dragging: 'dragging',
    selected: 'selected',
    icon: 'icon',
    label: 'label',
  },
  icon: <Chevron></Chevron>,
};

Edge.Tab = Tab;
Edge.Group = Group;

// ----------------------------------------------------------------------------

export interface EdgeElementProps {
  className?: string;
  classNames?: {
    dragging?: string;
    selected?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  type?: TabItemType;
  dragging: boolean;
  selected: boolean;
  invisible: boolean;
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  children?: React.ReactNode;
  tabItems?: TabItem[];
}

export const EdgeElement = (props: EdgeElementProps) => {
  if (props.type === 'item') {
    return <EdgeItem {...props} />;
  } else {
    return <EdgeGroup {...props} />;
  }
};

export default Edge;

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
  createTabTree,
  elementChildren,
  TabItemType,
  TabElement,
  TabTree,
  TreeState,
  TabNode,
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

  const { state: defaultTreeState, static: treeStatic } = createTabTree(
    props.children
  );
  const [items, setItems] = React.useState(defaultTreeState);
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
      // If group, then just perform closest center with other root items,
      // since groups cannot be placed under other groups
      const draggingElement = items.byId[dragging];
      if (dragging && draggingElement.type === 'group') {
        return closestAdjustedCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => {
            return items.rootIds.includes(container.id as string);
          }),
        });
      }

      // Start by finding any pointer intersecting droppable
      const pointerInteractions = pointerWithin(args);
      const intersections =
        pointerInteractions.length > 0
          ? pointerInteractions
          : rectIntersection(args);
      let overId = getFirstCollision(intersections, 'id');

      if (overId !== null) {
        const overNode = items.byId[overId];
        if (overNode.type === 'group') {
          // const containerItems = overNode.children;
          // overId = closestAdjustedCenter({
          //   ...args,
          //   droppableContainers: args.droppableContainers.filter(
          //     (container) =>
          //       container.id !== overId &&
          //       containerItems.includes(container.id as string)
          //   ),
          // })[0]?.id;
        }

        lastOverId.current = overId;

        return [{ id: overId }];
      }

      // When a draggable item moves to a new container, the layout may shift
      // and the `overId` may become `null`. We manually set the cached `lastOverId`
      // to the id of the draggable item that was moved to the new container, otherwise
      // the previous `overId` will be returned which can cause items to incorrectly shift positions
      if (recentlyMovedToNewContainer.current) {
        lastOverId.current = dragging;
      }

      // If no droppable is matched, return the last match
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [dragging, items]
  );

  const findContainer = (id: UniqueIdentifier) => {
    const node = items.byId[id];
    if (node.type === 'group') {
      return id;
    }

    for (const rootId of items.rootIds) {
      if (items.byId[rootId].children.includes(id as string)) {
        return rootId;
      }
    }

    return null;
  };

  const handleDragStart = (event: DragMoveEvent) => {
    if (event.active) {
      setDragging(event.active.id as string);
    }
  };

  const handleDragOver = (event: DragMoveEvent) => {
    const { active, over } = event;

    const overId = over.id;
    const activeNode = items.byId[active.id];
    if (overId === null || activeNode.type === 'group') {
      return; // return if dragging group node or not over anything
    }

    const overContainer = findContainer(overId);
    const activeContainer = findContainer(active.id);

    if (!overContainer && !activeContainer) {
      return; // if not over a container, just return
    }

    setItems((items) => {
      const overItems = overContainer
        ? items.byId[overContainer].children
        : items.rootIds;
      const overIndex = overItems.indexOf(overId as string);

      let newIndex = 0;
      if (items.byId[overId].type === 'group') {
        // overId is just the container, push to last item
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top > over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      recentlyMovedToNewContainer.current = true;

      const newItems = {
        ...items,
      };

      if (!activeContainer) {
        // If not in container remove from root
        newItems.rootIds = items.rootIds.filter((item) => item !== active.id);
      } else if (activeContainer) {
        // If in old container, remove from container, else remove from root
        newItems.byId[activeContainer] = {
          ...newItems.byId[activeContainer],
          children: newItems.byId[activeContainer].children.filter(
            (item) => item !== active.id
          ),
        };
      }

      // Insert into new container
      if (!overContainer) {
        // If not over container, add to root
        newItems.rootIds = [
          ...newItems.rootIds.slice(0, newIndex),
          active.id as string,
          ...newItems.rootIds.slice(newIndex),
        ];
      } else {
        // If over container, insert into new container
        newItems.byId[overContainer] = {
          ...newItems.byId[overContainer],
          children: [
            ...newItems.byId[overContainer].children.slice(0, newIndex),
            active.id as string,
            ...newItems.byId[overContainer].children.slice(newIndex),
          ],
        };
      }

      return newItems;
    });
  };

  const handleDragEnd = (event: DragMoveEvent) => {
    const { active, over } = event;

    setDragging(null);
    if (items.byId[active.id].type === 'group') {
      setItems((items: TreeState) => {
        const oldIndex = items.rootIds.findIndex((id) => id === active.id);
        const newIndex = items.rootIds.findIndex((id) => id === over.id);
        return {
          ...items,
          rootIds: arrayMove(items.rootIds, oldIndex, newIndex),
        };
      });
    }
  };

  const handleItemClick = (id: string) => {
    setSelected(id);
  };

  const renderElement = (
    node: TabNode,
    element: TabElement,
    visible: boolean
  ) => {
    return (
      <EdgeElement
        className={element.className}
        classNames={element.classNames}
        style={element.style}
        id={node.id}
        type={element.type}
        dragging={dragging}
        selected={selected}
        invisible={!visible}
        icon={element.icon}
        color={element.color}
        onClick={handleItemClick}
        children={elementChildren(element)}
        tabItems={node.children}
        tree={{ state: items, static: treeStatic }}
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
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToFirstScrollableAncestor,
          ]}
        >
          <SortableContext
            items={items.rootIds}
            strategy={verticalListSortingStrategy}
          >
            {items.rootIds.map((id) => {
              const node = items.byId[id];
              const element = treeStatic[id];
              return (
                <Sortable className={'sortable'} key={node.id} id={node.id}>
                  {renderElement(node, element, dragging !== node.id)}
                </Sortable>
              );
            })}
          </SortableContext>
          <DragOverlay>
            {dragging
              ? renderElement(items.byId[dragging], treeStatic[dragging], true)
              : null}
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
  dragging?: string;
  selected?: string;
  invisible: boolean;
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  children?: React.ReactNode;
  tabItems?: string[];
  tree?: TabTree;
}

export const EdgeElement = (props: EdgeElementProps) => {
  if (props.type === 'item') {
    return <EdgeItem {...props} />;
  } else {
    return <EdgeGroup {...props} />;
  }
};

export default Edge;

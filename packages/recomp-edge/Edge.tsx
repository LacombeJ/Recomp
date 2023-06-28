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
import { useModel, Update, Draft, useMeasure, Rect } from '@recomp/hooks';

import { EdgeItem } from './Item';
import { EdgeGroup } from './Group';
import { Sortable } from './Sortable';
import { closestAdjustedCenter } from './collision';
import {
  Tooltip,
  calculateParentAnchor,
  useTooltipCalculations,
} from '@recomp/core';
import { animated } from '@react-spring/web';

// ----------------------------------------------------------------------------

export interface EdgeModel {
  byId: { [id: string]: EdgeTab };
  rootIds: string[];
}

export type EdgeTab = string | EdgeTabGroup;

export interface EdgeTabGroup {
  id: string;
  expanded?: boolean;
  items: string[];
}

// ----------------------------------------------------------------------------

interface EdgeProps {
  className?: string;
  classNames?: {
    scrollable?: string;
    dragging?: string;
    minimized?: string;
    tooltip?: string;
    tooltipOffset?: string;
    tooltipOverlay?: string;
  };
  style?: React.CSSProperties;
  model?: EdgeModel;
  defaultModel?: EdgeModel;
  selected?: string;
  defaultSelected?: string;
  children?: React.ReactNode;
  onRenderItem?: (id: string) => TabProps;
  onRenderGroup?: (id: string) => GroupProps;
  onTooltip?: (id: string) => string;
  onItemClose?: (id: string) => any;
  onItemContextMenu?: (e: React.MouseEvent, id: string) => any;
  onGroupContextMenu?: (e: React.MouseEvent, id: string) => any;
  onUpdateModel?: Update<EdgeModel>;
  onEmitUpdate?: (event: EdgeModelUpdateEvent) => any;
  onSelected?: Update<string>;
  onItemDoubleClick?: (id: string) => any;
}

export interface EdgeModelUpdateEvent {
  type: 'move' | 'swap' | 'expand';
  active: string;
  moveFrom: null | string;
  moveTo: null | string;
  moveFromIndex: number;
  moveToIndex: number;
  expand: boolean;
}

export const Edge = (props: EdgeProps) => {
  props = util.propUnion(defaultProps, props);

  const [selected, setSelected] = useModel(
    props.defaultSelected,
    props.selected,
    props.onSelected
  );

  const [model, setModel] = useModel(
    props.defaultModel,
    props.model,
    props.onUpdateModel
  );

  const [dragging, setDragging] = React.useState<string>(null);

  const [edgeRef, edgeMeasure] = useMeasure();

  const isMinimized = React.useMemo(() => {
    return edgeMeasure.contentRect.width < 100;
  }, [edgeMeasure.contentRect.width]);

  const tooltipCalc = useTooltipCalculations();
  const tooltipAnchor = calculateParentAnchor(
    'left',
    edgeMeasure.clientRect.x,
    edgeMeasure.clientRect.width
  );

  const tooltipStyle: any = {
    ...tooltipCalc.moveTip,
    ...tooltipAnchor,
  };

  const lastOverId = React.useRef<UniqueIdentifier | null>(null);
  const recentlyMovedToNewContainer = React.useRef(false);

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.dragging]: dragging !== null,
    [props.classNames.minimized]: isMinimized,
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
      const draggingElement = model.byId[dragging];

      if (dragging && isGroup(draggingElement)) {
        return closestAdjustedCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => {
            return model.rootIds.includes(container.id as string);
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
        const overNode = model.byId[overId];
        if (isGroup(overNode)) {
          // If over a group, but possibly inbetween items, find closest
          const containerItems = overNode.items;

          const closestId = closestAdjustedCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId &&
                containerItems.includes(container.id as string)
            ),
          })[0]?.id;
          if (closestId) {
            overId = closestId;
          }
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
    [dragging, model]
  );

  const determineDroppableContainer = (id: UniqueIdentifier) => {
    const node = model.byId[id];

    if (isGroup(node)) {
      // If container is not expanded, cannot drop inside, return null
      if (node.expanded) {
        return id;
      } else {
        return null;
      }
    }

    for (const rootId of model.rootIds) {
      const element = model.byId[rootId];
      if (isGroup(element) && element.items.includes(id as string)) {
        return rootId;
      }
    }

    return null;
  };

  const findParentContainer = (id: UniqueIdentifier) => {
    if (model.rootIds.includes(id as string)) {
      return null;
    }

    for (const rootId of model.rootIds) {
      const element = model.byId[rootId];
      if (isGroup(element) && element.items.includes(id as string)) {
        return element.id;
      }
    }

    throw new Error('Could not find parent container');
  };

  const handleDragStart = (event: DragMoveEvent) => {
    if (event.active) {
      setDragging(event.active.id as string);
    }
  };

  const handleDragOver = (event: DragMoveEvent) => {
    const { active, over } = event;

    const overId = over.id;
    const activeNode = model.byId[active.id];
    if (overId === null || isGroup(activeNode)) {
      return; // return if dragging group node or not over anything
    }

    const overContainer = determineDroppableContainer(overId);
    const activeContainer = findParentContainer(active.id);

    if (!overContainer && !activeContainer) {
      return; // if not over a container, just return
    }

    const overTabGroup = model.byId[overContainer] as EdgeTabGroup;
    const overItems = overContainer ? overTabGroup.items : model.rootIds;
    const overIndex = overItems.indexOf(overId as string);

    let newIndex = 0;
    const isBelowOverItem =
      over &&
      active.rect.current.translated &&
      active.rect.current.translated.top > over.rect.top + over.rect.height;

    const modifier = isBelowOverItem ? 1 : 0;
    newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;

    if (isGroup(model.byId[overId])) {
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

    props.onEmitUpdate?.({
      type: 'move',
      active: active.id as string,
      moveFrom: activeContainer as string,
      moveTo: overContainer as string,
      moveFromIndex: -1,
      moveToIndex: newIndex,
      expand: false,
    });

    setModel((model) => {
      if (!activeContainer) {
        model.rootIds = model.rootIds.filter((item) => item !== active.id);
      } else if (activeContainer) {
        // If in old container, remove from container
        const oldContainer = model.byId[activeContainer] as Draft<EdgeTabGroup>;
        oldContainer.items = oldContainer.items.filter(
          (item) => item !== active.id
        );
      }

      // Insert into new container
      if (!overContainer) {
        // If not over container, add to root
        model.rootIds.splice(newIndex, 0, active.id as string);
      } else {
        // If over container, insert into new container
        const newContainer = model.byId[overContainer] as Draft<EdgeTabGroup>;
        newContainer.items.splice(newIndex, 0, active.id as string);
      }
    });
  };

  const handleDragEnd = (event: DragMoveEvent) => {
    const { active, over } = event;

    setDragging(null);

    if (model.rootIds.includes(active.id as string)) {
      const oldIndex = model.rootIds.findIndex((id) => id === active.id);
      const newIndex = model.rootIds.findIndex((id) => id === over.id);

      props.onEmitUpdate?.({
        type: 'swap',
        active: active.id as string,
        moveFrom: null,
        moveTo: null,
        moveFromIndex: oldIndex,
        moveToIndex: newIndex,
        expand: false,
      });

      setModel((model) => {
        model.rootIds = arrayMove(model.rootIds, oldIndex, newIndex);
      });
    }
  };

  const handleItemClick = (id: string, rect: Rect) => {
    setSelected(() => id);
    tooltipCalc.handleItemClick(id, rect);
  };

  const handleItemClose = (id: string) => {
    props.onItemClose?.(id);
  };

  const handleElementMouseEnter = (id: string, rect: Rect) => {
    // Determine tooltip from callback
    const tooltip = props.onTooltip?.(id);
    tooltipCalc.handleItemMouseEnter(id, tooltip, rect);
  };
  const handleElementMouseLeave = (id: string) => {
    tooltipCalc.handleItemMouseLeave(id);
  };

  const handleItemContextMenu = (e: React.MouseEvent, id: string) => {
    props.onItemContextMenu?.(e, id);
  };

  const handleGroupContextMenu = (e: React.MouseEvent, id: string) => {
    props.onGroupContextMenu?.(e, id);
  };

  const handleGroupClick = (id: string, rect: Rect) => {
    const group = model.byId[id] as EdgeTabGroup;

    props.onEmitUpdate?.({
      type: 'expand',
      active: id,
      moveFrom: null,
      moveTo: null,
      moveFromIndex: -1,
      moveToIndex: -1,
      expand: !group.expanded,
    });

    setModel((model) => {
      const group = model.byId[id] as Draft<EdgeTabGroup>;
      group.expanded = !group.expanded;
    });

    tooltipCalc.handleItemClick(id, rect);
  };

  const renderDragging = () => {
    const node = model.byId[dragging];

    if (isGroup(node)) {
      const groupProps: GroupProps = util.propUnion(
        groupDefaultProps,
        props.onRenderGroup(dragging)
      );
      return (
        <EdgeGroup
          id={node.id}
          expanded={node.expanded}
          invisible={false}
          selected={selected}
          dragging={dragging}
          animated={false}
          model={model}
          onRenderItem={props.onRenderItem}
          onItemClick={handleItemClick}
          onItemDoubleClick={props.onItemDoubleClick}
          onItemClose={handleItemClose}
          onGroupClick={handleGroupClick}
          onItemContextMenu={handleItemContextMenu}
          onGroupContextMenu={handleGroupContextMenu}
          {...groupProps}
        />
      );
    } else {
      const itemProps: TabProps = util.propUnion(
        tabDefaultProps,
        props.onRenderItem(dragging)
      );
      return (
        <EdgeItem
          id={node}
          invisible={false}
          selected={selected}
          dragging={dragging}
          onClick={handleItemClick}
          onDoubleClick={props.onItemDoubleClick}
          onCloseClick={handleItemClose}
          onContextMenu={handleItemContextMenu}
          {...itemProps}
        />
      );
    }
  };

  return (
    <div className={className} ref={edgeRef}>
      <div className={props.classNames.tooltipOverlay}>
        {tooltipCalc.tooltipVisible ? (
          <animated.div
            className={props.classNames.tooltip}
            style={tooltipStyle}
          >
            <div className={props.classNames.tooltipOffset}>
              <Tooltip.Animated
                position="right"
                animatedStyle={tooltipCalc.expandTip}
                onResize={tooltipCalc.handleTooltipSize}
              >
                {tooltipCalc.tooltip}
              </Tooltip.Animated>
            </div>
          </animated.div>
        ) : null}
      </div>
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
            items={model.rootIds}
            strategy={verticalListSortingStrategy}
          >
            {model.rootIds.map((id) => {
              const node = model.byId[id];
              if (isGroup(node)) {
                const groupProps: GroupProps = util.propUnion(
                  groupDefaultProps,
                  props.onRenderGroup(id)
                );
                return (
                  <Sortable
                    className={'sortable'}
                    key={node.id}
                    id={node.id}
                    handle={true}
                  >
                    <EdgeGroup
                      id={node.id}
                      expanded={node.expanded}
                      invisible={dragging === node.id}
                      selected={selected}
                      dragging={dragging}
                      animated={true}
                      model={model}
                      onRenderItem={props.onRenderItem}
                      onItemClick={handleItemClick}
                      onItemDoubleClick={props.onItemDoubleClick}
                      onItemClose={handleItemClose}
                      onGroupClick={handleGroupClick}
                      onItemContextMenu={handleItemContextMenu}
                      onGroupContextMenu={handleGroupContextMenu}
                      onMouseEnter={handleElementMouseEnter}
                      onMouseLeave={handleElementMouseLeave}
                      {...groupProps}
                    />
                  </Sortable>
                );
              } else {
                const itemProps: TabProps = util.propUnion(
                  tabDefaultProps,
                  props.onRenderItem(id)
                );

                return (
                  <Sortable className={'sortable'} key={node} id={node}>
                    <EdgeItem
                      id={node}
                      invisible={dragging === node}
                      selected={selected}
                      dragging={dragging}
                      onClick={handleItemClick}
                      onDoubleClick={props.onItemDoubleClick}
                      onCloseClick={handleItemClose}
                      onContextMenu={handleItemContextMenu}
                      onMouseEnter={handleElementMouseEnter}
                      onMouseLeave={handleElementMouseLeave}
                      {...itemProps}
                    />
                  </Sortable>
                );
              }
            })}
          </SortableContext>
          <DragOverlay>{dragging ? renderDragging() : null}</DragOverlay>
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
    minimized: 'minimized',
    tooltip: 'tooltip',
    tooltipOffset: 'tooltip-offset',
    tooltipOverlay: 'tooltip-overlay',
  },
  onRenderItem: (id: string) => ({ children: id }),
  onRenderGroup: (id: string) => ({ children: id }),
  onTooltip: (id: string) => id,
};

// ----------------------------------------------------------------------------

export interface TabProps {
  className?: string;
  classNames?: {
    dragging?: string;
    selected?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const tabDefaultProps: TabProps = {
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
    selected?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  color?: string;
  children?: React.ReactNode;
}

export const groupDefaultProps: GroupProps = {
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

// ----------------------------------------------------------------------------

export const isItem = (element: EdgeTab): element is string => {
  return typeof element === 'string';
};

export const isGroup = (element: EdgeTab): element is EdgeTabGroup => {
  return typeof element !== 'string';
};

export const createModel = (items: EdgeTab[]): EdgeModel => {
  const model: EdgeModel = {
    byId: {},
    rootIds: [],
  };

  for (const item of items) {
    if (isItem(item)) {
      model.byId[item] = item;
      model.rootIds.push(item);
    } else {
      const group: EdgeTabGroup = {
        id: item.id,
        expanded: item.expanded,
        items: [],
      };
      model.byId[item.id] = group;
      model.rootIds.push(item.id);
      for (const c of item.items) {
        model.byId[c] = c;
        group.items.push(c);
      }
    }
  }

  return model;
};

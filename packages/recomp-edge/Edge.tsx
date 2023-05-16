import * as React from 'react';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
  DragMoveEvent,
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

import { mapTabElements, elementChildren } from './common';
import { SortableItem } from './SortableItem';

// ----------------------------------------------------------------------------

interface EdgeProps {
  className?: string;
  classNames?: {
    scrollable?: string;
    dragging?: string;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Edge = (props: EdgeProps) => {
  props = util.structureUnion(defaultProps, props);

  const [selected, setSelected] = React.useState('');

  const { mapppedElements, orderedIds } = mapTabElements(props.children);
  const [items, setItems] = React.useState(orderedIds);
  const [dragging, setDragging] = React.useState<string | null>(null);

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

  return (
    <div className={className}>
      <div className={props.classNames.scrollable}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
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
                <SortableItem
                  className={element.className}
                  classNames={element.classNames}
                  style={element.style}
                  key={element.id}
                  id={element.id}
                  type={element.type}
                  dragging={dragging === element.id}
                  selected={selected === element.id}
                  icon={element.icon}
                  color={element.color}
                  onClick={handleItemClick}
                  children={elementChildren(element)}
                />
              );
            })}
          </SortableContext>
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

export default Edge;

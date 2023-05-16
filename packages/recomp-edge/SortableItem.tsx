import * as React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { Transform } from '@dnd-kit/utilities';

import { TabItemType } from './common';

import { EdgeItem } from './Item';
import { EdgeGroup } from './Group';

export interface SortableItemProps {
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
  icon?: React.ReactNode;
  color?: string;
  onClick?: (id: string) => any;
  children?: React.ReactNode;
}

const translation = (transform: Transform) => {
  if (transform) {
    return `translate3d(${transform.x}px, ${transform.y}px, 0)`;
  }
};

export const SortableItem = (props: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const { style: _0, ...restProps } = props;

  const style = {
    transform: translation(transform),
    transition,
  };

  if (props.type === 'item') {
    return (
      <EdgeItem
        style={style}
        divRef={setNodeRef}
        attributes={attributes}
        listeners={listeners}
        {...restProps}
      />
    );
  } else {
    return (
      <EdgeGroup
        style={style}
        divRef={setNodeRef}
        attributes={attributes}
        listeners={listeners}
        {...restProps}
      />
    );
  }
};

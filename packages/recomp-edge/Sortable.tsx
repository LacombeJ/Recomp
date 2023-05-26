import * as React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useChildrenProps } from '@recomp/hooks';
import { EdgeGroup } from './Group';

export interface SortableProps {
  className?: string;
  style?: React.CSSProperties;
  id: string;
  handle?: boolean;
  children?: React.ReactNode;
}

export const Sortable = (props: SortableProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [cloner] = useChildrenProps<any>((child, _childProps) => {
    if (props.handle) {
      if (
        child &&
        child.type &&
        child.type.identifier === EdgeGroup.identifier
      ) {
        return {
          handleListeners: listeners,
          handleRef: setActivatorNodeRef,
        };
      }
    }
  });

  return (
    <div
      className={props.className}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...(!props.handle ? listeners : undefined)}
    >
      {cloner(props.children)}
    </div>
  );
};

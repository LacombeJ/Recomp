import * as React from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface SortableProps {
  className?: string;
  style?: React.CSSProperties;
  id: string;
  children?: React.ReactNode;
}

export const Sortable = (props: SortableProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={props.className}
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </div>
  );
};

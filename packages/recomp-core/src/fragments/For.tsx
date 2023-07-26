import * as React from 'react';

interface ForProps<T> {
  each: T[];
  children: (item: T, index: number) => React.ReactNode;
}

export const For = <T,>(props: ForProps<T>) => {
  return props.each.map(props.children);
};

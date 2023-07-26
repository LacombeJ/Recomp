import * as React from 'react';

interface ShowProps {
  when: boolean;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

/** Conditional rendering */
export const Show = (props: ShowProps) => {
  props = { ...defaultProps, ...props };
  if (props.when) {
    return props.children;
  } else {
    return props.fallback;
  }
};

const defaultProps: ShowProps = {
  when: false,
  fallback: false,
};

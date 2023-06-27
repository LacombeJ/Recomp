import * as React from 'react';

/**
 * Hook for detecting if mouse is inside a component. This is useful in scenarios
 * where if mouse is inside a child component, the parent component should be
 * rendered differently. As far as I know, this isn't possible with CSS cascade
 * rules. So instead, just attach listeners on children and use state in parent.
 */
export const useMouseInside = (initialValue: boolean) => {
  const [inside, setInside] = React.useState(initialValue);

  const onMouseEnter = () => {
    setInside(true);
  };
  const onMouseLeave = () => {
    setInside(false);
  };

  return {
    inside,
    onMouseEnter,
    onMouseLeave,
    props: { onMouseEnter, onMouseLeave },
  };
};

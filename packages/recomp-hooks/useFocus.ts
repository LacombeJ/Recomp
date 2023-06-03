import * as React from 'react';

interface FocusConfig {
  /** If set to true, escape key will be ignored for unfocusing */
  ignoreEscape?: boolean;
}

/**
 * Handles custom focus/blur logic by adding document listeners
 * @param onMount
 */
export const useFocus = (onMount: () => any) => {
  const elementRef = React.useRef<HTMLElement>();

  const [focused, setFocused] = React.useState(false);

  React.useEffect(() => {
    if (focused) {
      // Mouse down listener
      const handleMouseDown: EventListener = (event) => {
        // if (event.target !== elementRef.current) {
        //   setFocused(false); // Clicked off of element
        //   elementRef.current.focus();
        // } else {
        //   setFocused(true); // clicked on element
        //   elementRef.current.;
        // }
      };
      document.addEventListener('mousedown', handleMouseDown, {});

      // Unsubscribe / remove listeners
      return () => {
        document.removeEventListener('mousedown', handleMouseDown, {});
      };
    }
  }, [elementRef.current, focused]);

  const setRef = (element: HTMLElement) => {
    elementRef.current = element;
  };

  return [focused, setFocused, setRef];
};

import * as React from 'react';
import useTimeout from './useTimeout';

export type MouseInsideProps = {
  delayMS?: number;
  debounceOnMotion?: boolean;
  onHover?: (hover: boolean, position: { x: number; y: number }) => void;
};

/**
 * Hook for detecting if mouse is hovering inside a component. It is
 * different than useMouseInside because it activate after a delay
 * or even debounce if mouse moves.
 */
export const useMouseHover = (props: MouseInsideProps = {}) => {
  props = { ...defaultMouseInsideProps, ...props };

  const [hover, setHover] = React.useState(false);
  const mousePosRef = React.useRef({ x: 0, y: 0 });

  const timeout = useTimeout(props.delayMS);

  const handleHover = (hover: boolean) => {
    // Using callback setState to only trigger once (so that position doesn't change)
    setHover((state) => {
      if (state !== hover) {
        props.onHover?.(hover, {
          x: mousePosRef.current.x,
          y: mousePosRef.current.y,
        });
      }
      return hover;
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    const { x, y } = { x: e.clientX, y: e.clientY };
    if (!hover) {
      if (props.debounceOnMotion) {
        if (x !== mousePosRef.current.x && y !== mousePosRef.current.y) {
          timeout.cancel();
        } else {
        }
        // console.log();
      } else {
        if (!hover) {
        }
      }

      timeout.begin(() => {
        handleHover(true);
      });
    }
    mousePosRef.current = { x, y };
  };
  const onMouseLeave = () => {
    timeout.cancel();
    handleHover(false);
  };

  return {
    hover,
    onMouseMove,
    onMouseLeave,
    itemProps: { onMouseMove, onMouseLeave },
  };
};

const defaultMouseInsideProps: MouseInsideProps = {
  debounceOnMotion: true,
  delayMS: 500,
};

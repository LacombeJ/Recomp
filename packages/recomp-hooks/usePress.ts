import * as React from 'react';

/**
 * Similar to a click event, calls onPress after mouse down and mouse
 * up (without exiting)
 * */
const usePress = (
  onPress: (e: React.MouseEvent) => any
): [(e: React.MouseEvent) => any, (e: React.MouseEvent) => any, () => any] => {
  const downTarget: React.MutableRefObject<EventTarget> = React.useRef();

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      downTarget.current = e.target;
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (downTarget.current !== null) {
      if (downTarget.current === e.currentTarget) {
        onPress(e);
      }
    }
  };

  const handleMouseLeave = () => {
    downTarget.current = null;
  };

  return [handleMouseDown, handleMouseUp, handleMouseLeave];
};

export default usePress;

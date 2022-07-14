import React from 'react';

import useEventListener from './useEventListener';

const useInteract = (handleMouseUp, handleMouseMove) => {
  const [mouseUpSub, setMouseUpSub] = React.useState(false);
  const [mouseMoveSub, setMouseMoveSub] = React.useState(false);

  useEventListener(document, 'mouseup', handleMouseUp, {}, !mouseUpSub);
  useEventListener(document, 'mousemove', handleMouseMove, {}, !mouseMoveSub);

  const subscribeMouseUp = () => {
    document.addEventListener('mouseup', handleMouseUp);
    setMouseUpSub(true);
  };
  const subscribeMouseMove = () => {
    document.addEventListener('mousemove', handleMouseMove);
    setMouseMoveSub(true);
  };

  const unsubscribeMouseUp = () => {
    document.removeEventListener('mouseup', handleMouseUp);
    setMouseUpSub(false);
  };
  const unsubscribeMouseMove = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    setMouseMoveSub(false);
  };

  return [
    subscribeMouseUp,
    subscribeMouseMove,
    unsubscribeMouseUp,
    unsubscribeMouseMove,
  ];
};

export default useInteract;

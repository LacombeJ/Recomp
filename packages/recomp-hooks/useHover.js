import React from 'react';

/**
 * @param {boolean} initialState
 * @returns {[boolean, (value: boolean) => void, (value: boolean) => void]}
 */
const useHover = (initialValue) => {
  const [hover, setHover] = React.useState(initialValue);
  const handleMouseEnter = (e) => {
    setHover(true);
  };
  const handleMouseLeave = (e) => {
    setHover(false);
  };
  return [hover, handleMouseEnter, handleMouseLeave];
};

export default useHover;

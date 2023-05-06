import * as React from 'react';

const useHover = (initialValue: boolean): [boolean, () => any, () => any] => {
  const [hover, setHover] = React.useState(initialValue);
  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };
  return [hover, handleMouseEnter, handleMouseLeave];
};

export default useHover;

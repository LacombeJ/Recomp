import * as React from 'react';

const Maximize = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 50 50"
      width="10"
      height="10"
      fill="currentColor"
    >
      <path d="M0 0L50 0L50 5.47L0 5.47L0 0Z"></path>
      <path d="M45.31 3.91L50 3.91L50 50L45.31 50L45.31 3.91Z"></path>
      <path d="M0 45.31L46.88 45.31L46.88 50L0 50L0 45.31Z"></path>
      <path d="M0 3.91L5.47 3.91L5.47 46.88L0 46.88L0 3.91Z"></path>
    </svg>
  );
};

export default Maximize;

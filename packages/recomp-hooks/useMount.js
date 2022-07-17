import React from 'react';

const useMount = (onMount) => {
  React.useEffect(onMount, []);
};

export default useMount;

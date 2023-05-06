import * as React from 'react';

const useMount = (onMount: () => any) => {
  React.useEffect(onMount, []);
};

export default useMount;

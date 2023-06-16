import * as React from 'react';
import Fuse from 'fuse.js';

export const useFuse = <T>(list: T[], options?: Fuse.IFuseOptions<T>) => {
  const fuseRef = React.useRef<Fuse<T>>(new Fuse(list, options));

  React.useEffect(() => {
    fuseRef.current = new Fuse(list, options);
  }, [list, options]);

  const search = (
    pattern: string | Fuse.Expression,
    options?: Fuse.FuseSearchOptions
  ) => {
    if (!pattern) {
      return list;
    }
    const results = fuseRef.current.search(pattern, options);
    return results.map((value) => value.item);
  };

  return search;
};

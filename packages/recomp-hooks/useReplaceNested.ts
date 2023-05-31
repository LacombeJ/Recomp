import * as React from 'react';

/**
 * Like useReplaceChildren but is nested
 */
export const useReplaceNested = <P>(
  replacer: (child: any, childProps: P) => React.ReactNode | void,
  deps?: React.DependencyList
) => {
  const callback = React.useCallback((children: any): any => {
    return React.Children.map(children, (child: any) => {
      if (!React.isValidElement(child)) return child;

      const props = (child as any).props;
      const replacedChild = replacer(child, props);
      if (replacedChild) {
        return replacedChild;
      } else {
        return React.cloneElement(child, {
          ...props,
          children: callback(props.children),
        });;
      }
    });
  }, deps);

  return [callback];
};

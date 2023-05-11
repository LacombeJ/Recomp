import * as React from 'react';

/**
 * Replaces direct children of one type of element for another, allowing for the updating
 * and addition of new props. This is similar to useNestedProps but the child
 * element is replaced and this only goes one level deep (direct children).
 */
const useReplaceChildren = <P>(
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
        return child;
      }
    });
  }, deps);

  return [callback];
};

export default useReplaceChildren;

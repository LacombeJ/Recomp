import * as React from 'react';

/**
 * This is similar to useNestedProps and useReplaceChildren
 */
const useChildrenProps = <P>(
  cloner: (child: any, childProps: P) => any,
  deps?: React.DependencyList
) => {
  const callback = React.useCallback((children: any): any => {
    return React.Children.map(children, (child: any) => {
      if (!React.isValidElement(child)) return child;

      const props = (child as any).props;
      const updatedProps = cloner(child, props);

      if (updatedProps) {
        return React.cloneElement(child, {
          ...props,
          ...updatedProps,
        });
      } else {
        return child;
      }
    });
  }, deps);

  return [callback];
};

export default useChildrenProps;

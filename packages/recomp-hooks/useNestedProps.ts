import * as React from 'react';

/**
 * Recurses over nested children and allows modification and prop setting.
 *
 * Cloner callback function should return an object props with a set of properties
 * to update prop values with (old values that do not need to be changed do not
 * need to be included).
 *
 * The cloner callback function should set the result break property to true
 * in order to stop the clone recurse callback from being applied to further
 * children.
 */
const useNestedProps = (
  cloner: (child: any) => ClonerResult | void,
  deps?: React.DependencyList
) => {
  const callback = React.useCallback((children: any): any => {
    return React.Children.map(children, (child: any) => {
      if (!React.isValidElement(child)) return child;

      const props = (child as any).props;
      const updatedProps = cloner(child);
      if (updatedProps) {
        if (updatedProps.props) {
          return React.cloneElement(child, {
            ...props,
            ...updatedProps.props,
            children: callback(props.children),
          });
        }
        if (updatedProps.break) {
          return child;
        }
      }

      return React.cloneElement(child, {
        ...props,
        children: callback(props.children),
      });
    });
  }, deps);

  return [callback];
};

interface ClonerResult {
  props?: any;
  break?: boolean;
}

export default useNestedProps;

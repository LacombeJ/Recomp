import * as React from 'react';

/**
 * Hook made to handle child component callbacks
 */
export const useHandle = <H>(
  deps?: React.DependencyList
): [(handlers: H) => any, React.MutableRefObject<H>] => {
  const handlersRef = React.useRef<H>(null);

  const assign = React.useCallback((handlers: H) => {
    handlersRef.current = handlers;
  }, deps);

  return [assign, handlersRef];
};

export const useHandleChildren = <P, A>(
  identifier: string,
  adjustProps: (props: P) => A,
  deps?: React.DependencyList
) => {
  const callback = React.useCallback((children: any): any => {
    return React.Children.map(children, (child: any) => {
      if (!React.isValidElement(child)) return child;

      const childAsAny = child as any;
      const props = childAsAny.props;

      if (childAsAny?.type?.identifier === identifier) {
        const updatedProps = adjustProps(props);
        if (updatedProps) {
          return React.cloneElement(child, {
            ...props,
            ...updatedProps,
            children: props.children,
          });
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

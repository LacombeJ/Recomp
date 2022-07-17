import React from 'react';

/**
 * This hook performs logic for handling updating internal state or executing
 * external callbacks for updating an external prop value.
 *
 * This is useful when you are authoring a component that can be modified whether
 * or not it has default value and internally managed state or whether state is
 * managed at a higher level. If not using props, this will return [state, setState],
 * otherwise this will return [prop, propCallback]
 *
 * @template T
 * @param {T} initialState Initial state (ignored if using props)
 * @param {T} propValue Prop value to return if using props
 * @param {(value: T) => void} propCallback Prop callback to return if using props
 *
 * @param useProps
 * If props should be used instead of state. If undefined this will be set
 * to true if either propValue or propCallback is defined
 *
 * @returns {[T, (value: T) => void]}
 */
const useStateOrProps = (
  initialState,
  propValue = undefined,
  propCallback = undefined,
  useProps = undefined
) => {
  const [state, setState] = React.useState(initialState);

  if (useProps === undefined) {
    if (propValue !== undefined || propCallback !== undefined) {
      useProps = true;
    }
  }

  let actualValue = state;
  let actualCallback = setState;

  if (useProps) {
    actualValue = propValue;
    actualCallback = propCallback;
  }

  return [actualValue, actualCallback];
};

export default useStateOrProps;

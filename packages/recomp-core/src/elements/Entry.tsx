import * as React from 'react';

import * as util from '@recomp/utility/common';
import { nonempty } from '@recomp/core';

interface EntryProps {
  className?: string;
  classNames?: {
    focused?: string;
    disabled?: string;
  };
  style?: React.CSSProperties;
  disabled?: boolean;
  children?: React.ReactNode;
  onMouseDown?: () => any;
  onFocus?: (focus: boolean) => any;
  setRef?: (element: HTMLDivElement) => any;
}

/**
 * Similar to input but for custom value and inner content
 */
export const Entry = (props: EntryProps) => {
  props = util.structureUnion(defaultProps, props);

  const entryRef = React.useRef<HTMLDivElement>();

  const [focused, setFocused] = React.useState(false);

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.focused]: focused,
    [props.classNames.disabled]: props.disabled,
  });

  const handleRef = (element: HTMLDivElement) => {
    props.setRef?.(element);
    entryRef.current = element;
  };

  const handleFocus = () => {
    setFocused(true);
    props.onFocus?.(true);
  };

  const handleBlur = () => {
    setFocused(false);
    props.onFocus?.(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      if (entryRef.current) {
        entryRef.current.blur();
      }
    }
  };

  // Click isn't used since it can interfere with focus
  const handleMouseDown = () => {
    props.onMouseDown?.();
  };

  return (
    <div
      tabIndex={0}
      className={className}
      style={props.style}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseDown={handleMouseDown}
      ref={handleRef}
    >
      {nonempty(props.children)}
    </div>
  );
};

const defaultProps: EntryProps = {
  className: 'recomp-entry',
  classNames: {
    focused: 'focused',
    disabled: 'disabled',
  },
};

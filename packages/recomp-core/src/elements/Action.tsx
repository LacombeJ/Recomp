import * as React from 'react';

import * as util from '@recomp/utility/common';

interface ActionProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  classNames?: {
    disabled?: string;
  };
  disabled?: boolean;
  setRef?: any;
}

export const Action = (props: ActionProps) => {
  props = util.propUnion(defaultProps, props);

  const {
    className: _0,
    classNames: _1,
    setRef: _2,
    onClick: _3,
    children: _4,
    dangerouslySetInnerHTML: _5,
    ...buttonProps
  } = props;

  const { classNames } = props;
  const className = util.classnames({
    [props.className]: true,
    [classNames.disabled]: props.disabled,
  });

  return (
    <button
      className={className}
      onClick={props.onClick}
      ref={props.setRef}
      {...buttonProps}
    >
      {props.children}
    </button>
  );
};

const defaultProps: ActionProps = {
  className: 'recomp-action',
  classNames: {
    disabled: 'disabled',
  },
  role: 'button',
  type: 'button',
  setRef: null,
};

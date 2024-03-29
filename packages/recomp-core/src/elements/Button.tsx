import * as React from 'react';

import { classnames, selectClassName } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

import { nonempty } from '../fragments/ZeroWidth';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  classNames?: {
    loading?: string;
    disabled?: string;
    variant?: {
      default?: string;
      primary?: string;
      warn?: string;
    };
  };
  variant?: 'default' | 'primary' | 'warn';
  disabled?: boolean;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  setRef?: any;
}

export const Button = (props: ButtonProps) => {
  props = propUnion(defaultProps, props);

  const {
    className: _0,
    classNames: _1,
    variant: _2,
    loading: _3,
    loadingIcon: _4,
    setRef: _5,
    onClick: _6,
    children: _7,
    dangerouslySetInnerHTML: _8,
    ...buttonProps
  } = props;

  const { classNames } = props;
  const className = classnames({
    [props.className]: true,
    [classNames.loading]: props.loading,
    [classNames.disabled]: props.disabled,
    ...selectClassName(classNames.variant, props.variant),
  });

  const handleClick = (e: any) => {
    props.onClick?.(e);
  };

  const clickHandler = !props.loading ? handleClick : undefined;

  let children = props.children;
  if (props.loading && props.loadingIcon) {
    children = props.loadingIcon;
  }

  return (
    <button
      className={className}
      onClick={clickHandler}
      ref={props.setRef}
      {...buttonProps}
    >
      {nonempty(children)}
    </button>
  );
};

const defaultProps: ButtonProps = {
  className: 'recomp-button',
  classNames: {
    loading: 'loading',
    disabled: 'disabled',
    variant: {
      default: 'default',
      primary: 'primary',
      warn: 'warn',
    },
  },
  variant: 'default',
  role: 'button',
  type: 'button',
  loading: false,
  loadingIcon: null,
  setRef: null,
};

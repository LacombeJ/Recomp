import * as React from 'react';

import * as util from '@recomp/utils';

import ZeroWidth from '../fragments/ZeroWidth';

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  classNames?: {
    loading?: string;
    disabled?: string;
  };
  disabled?: boolean;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  setRef: any;
}

const Button = (props: ButtonProps) => {
  props = util.structureUnion(defaultProps, props);

  const {
    className: _0,
    classNames: _1,
    loading: _2,
    loadingIcon: _3,
    setRef: _4,
    onClick: _5,
    children: _6,
    dangerouslySetInnerHTML: _7,
    ...buttonProps
  } = props;

  const { classNames } = props;
  const className = util.classnames({
    [props.className]: true,
    [classNames.loading]: props.loading,
    [classNames.disabled]: props.disabled,
  });

  const handleClick = (e: any) => {
    props.onClick(e);
  };

  const clickHandler = !props.loading ? handleClick : undefined;

  let children = props.children;
  if (props.loading && props.loadingIcon) {
    children = props.loadingIcon;
  }

  if (util.isNullOrWhitespace(children)) {
    children = <ZeroWidth />;
  }

  return (
    <button
      className={className}
      onClick={clickHandler}
      ref={props.setRef}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

const defaultProps: ButtonProps = {
  className: 'recomp-button',
  classNames: {
    loading: 'loading',
    disabled: 'disabled',
  },
  role: 'button',
  type: 'button',
  loading: false,
  loadingIcon: null,
  setRef: null,
};

export default Button;

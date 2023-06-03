import * as React from 'react';

import * as util from '@recomp/utility/common';

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  classNames?: {
    disabled?: string;
  };
  setRef?: React.LegacyRef<HTMLInputElement>;
}

export const Input = (props: InputProps) => {
  props = util.propUnion(defaultProps, props);

  const {
    classNames,
    setRef,
    className: _0,
    dangerouslySetInnerHTML: _1,
    ...inputProps
  } = props;

  const className = util.classnames({
    [props.className]: true,
    [classNames.disabled]: props.disabled,
  });

  return <input className={className} ref={setRef} {...inputProps} />;
};

const defaultProps: InputProps = {
  className: 'recomp-input',
  classNames: {
    disabled: 'disabled',
  },
  type: 'text',
  placeholder: '',
  readOnly: false,
  disabled: false,
};

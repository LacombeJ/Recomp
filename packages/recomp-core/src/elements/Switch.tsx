import * as React from 'react';

import * as util from '@recomp/utility/common';

import Checkbox from './Checkbox';

interface SwitchProps {
  className?: string;
  classNames?: {
    mark?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  size?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: () => any;
  children?: React.ReactNode;
}

const Switch = (props: SwitchProps) => {
  props = util.structureUnion(defaultProps, props);

  return <Checkbox {...props}></Checkbox>;
};

const defaultProps = {
  className: 'recomp-switch',
};

export default Switch;

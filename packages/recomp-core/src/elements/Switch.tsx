import * as React from 'react';

import { propUnion } from '@recomp/props';

import { Checkbox } from './Checkbox';

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

export const Switch = (props: SwitchProps) => {
  props = propUnion(defaultProps, props);

  return <Checkbox {...props}></Checkbox>;
};

const defaultProps = {
  className: 'recomp-switch',
};

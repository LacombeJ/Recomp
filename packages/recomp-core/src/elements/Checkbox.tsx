import * as React from 'react';

import * as util from '@recomp/utility/common';
import { useModel, Update } from '@recomp/hooks';

interface CheckboxProps {
  className?: string;
  classNames?: {
    mark?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  size?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  block?: boolean;
  onChecked?: Update<boolean>;
  children?: React.ReactNode;
}

export const Checkbox = (props: CheckboxProps) => {
  props = util.propUnion(defaultProps, props);
  const { className, classNames } = props;
  const style = {
    ...props.style,
    fontSize: props.size,
  };

  const [checked, setChecked] = useModel(
    props.defaultChecked,
    props.checked,
    props.onChecked
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(() => e.target.checked);
  };

  return (
    <label className={className} style={style}>
      <input type="checkbox" checked={checked} onChange={handleChange}></input>
      <span className={classNames.mark}></span>
      <span className={classNames.label}>{props.children}</span>
    </label>
  );
};

const defaultProps: CheckboxProps = {
  className: 'recomp-checkbox',
  classNames: {
    mark: 'mark',
    label: 'label',
  },
  defaultChecked: false,
  block: false,
  onChecked: () => {},
};

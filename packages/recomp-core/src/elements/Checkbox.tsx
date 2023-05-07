import * as React from 'react';

import * as util from '@recomp/utils';
import { useStateOrProps } from '@recomp/hooks';

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
  onChange?: () => any;
  children?: React.ReactNode;
}

const Checkbox = (props: CheckboxProps) => {
  props = util.structureUnion(defaultProps, props);
  const { className, classNames } = props;
  const style = {
    ...props.style,
    fontSize: props.size,
  };

  const [checked, setChecked] = useStateOrProps(
    props.defaultChecked,
    props.checked,
    props.onChange
  );

  const handleChange = (e: any) => {
    setChecked(e.target.checked);
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
  onChange: () => {},
};

export default Checkbox;

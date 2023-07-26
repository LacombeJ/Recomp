import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion, isNullOrWhitespace } from '@recomp/props';
import { useModel, Update } from '@recomp/hooks';
import { nonempty } from '../fragments/ZeroWidth';

interface CheckboxProps {
  className?: string;
  classNames?: {
    mark?: string;
    label?: string;
    margin?: string;
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
  props = propUnion(defaultProps, props);
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

  const labelClassName = classnames({
    [classNames.label]: true,
    [classNames.margin]: !isNullOrWhitespace(props.children),
  });

  return (
    <label className={className} style={style}>
      <input type="checkbox" checked={checked} onChange={handleChange}></input>
      <span className={classNames.mark}></span>
      <span className={labelClassName}>{nonempty(props.children)}</span>
    </label>
  );
};

const defaultProps: CheckboxProps = {
  className: 'recomp-checkbox',
  classNames: {
    mark: 'mark',
    label: 'label',
    margin: 'margin',
  },
  defaultChecked: false,
  block: false,
  onChecked: () => {},
};

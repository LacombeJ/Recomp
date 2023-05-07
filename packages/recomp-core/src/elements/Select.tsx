import * as React from 'react';

import * as util from '@recomp/utility/common';

interface SelectProps {
  className?: string;
  style?: React.CSSProperties;
  options?: string[];
  defaultValue?: string | number;
  value?: string | number;
  onChange?: () => any;
  children?: React.ReactNode;
}

const Select = (props: SelectProps) => {
  props = util.structureUnion(defaultProps, props);

  const { className, style } = props;

  return (
    <select
      className={className}
      style={style}
      defaultValue={props.defaultValue}
      value={props.value}
      onChange={props.onChange}
    >
      {selectChildren(props)}
    </select>
  );
};

const defaultProps: SelectProps = {
  className: 'recomp-select',
  onChange: () => {},
};

const selectChildren = (props: any) => {
  if (props.options) {
    return props.options.map((option: any) => {
      return (
        <option key={option} value={option}>
          {option}
        </option>
      );
    });
  }
  return props.children;
};

export default Select;

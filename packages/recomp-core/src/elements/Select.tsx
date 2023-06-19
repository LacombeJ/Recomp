import * as React from 'react';

import * as util from '@recomp/utility/common';

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  options: string[];
}

export const Select = (props: SelectProps) => {
  props = util.propUnion(defaultProps, props);

  const { options, dangerouslySetInnerHTML: _0, ...selectProps } = props;

  return <select {...selectProps}>{selectChildren(options)}</select>;
};

const defaultProps = {
  className: 'recomp-select',
};

const selectChildren = (options: string[]) => {
  return options.map((option) => {
    return (
      <option key={option} value={option}>
        {option}
      </option>
    );
  });
};

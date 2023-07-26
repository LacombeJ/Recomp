import * as React from 'react';

import { propUnion } from '@recomp/props';

interface LabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

export const Label = (props: LabelProps) => {
  props = propUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...labelProps } = props;

  return <label {...labelProps} />;
};

const defaultProps: LabelProps = {
  className: 'recomp-label',
};

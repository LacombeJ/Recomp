import * as React from 'react';

import * as util from '@recomp/utils';

interface LabelProps
  extends React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  > {}

const Label = (props: LabelProps) => {
  props = util.structureUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...labelProps } = props;

  return <label {...labelProps} />;
};

const defaultProps: LabelProps = {
  className: 'recomp-label',
};

export default Label;

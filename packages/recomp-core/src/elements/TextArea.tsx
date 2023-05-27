import * as React from 'react';

import * as util from '@recomp/utility/common';

interface TextAreaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

export const TextArea = (props: TextAreaProps) => {
  props = util.propUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...textAreaProps } = props;

  return <textarea {...textAreaProps} />;
};

const defaultProps: TextAreaProps = {
  className: 'recomp-textarea',
};


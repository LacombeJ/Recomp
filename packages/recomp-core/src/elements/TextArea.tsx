import * as React from 'react';

import * as util from '@recomp/utils';

interface TextAreaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

const Paragraph = (props: TextAreaProps) => {
  props = util.structureUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...textAreaProps } = props;

  return <textarea {...textAreaProps} />;
};

const defaultProps: TextAreaProps = {
  className: 'recomp-textarea',
};

export default Paragraph;

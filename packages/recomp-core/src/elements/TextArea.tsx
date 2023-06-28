import * as React from 'react';

import * as util from '@recomp/utility/common';

interface TextAreaProps
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  setRef?: React.LegacyRef<HTMLTextAreaElement>;
}

export const TextArea = (props: TextAreaProps) => {
  props = util.propUnion(defaultProps, props);

  const { setRef, dangerouslySetInnerHTML: _0, ...textAreaProps } = props;

  return <textarea ref={setRef} {...textAreaProps} />;
};

const defaultProps: TextAreaProps = {
  className: 'recomp-textarea',
};

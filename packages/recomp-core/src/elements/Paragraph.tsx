import * as React from 'react';

import { propUnion } from '@recomp/props';

interface ParagraphProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

export const Paragraph = (props: ParagraphProps) => {
  props = propUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...paragraphProps } = props;

  return <p {...paragraphProps} />;
};

const defaultProps: ParagraphProps = {
  className: 'recomp-paragraph',
};

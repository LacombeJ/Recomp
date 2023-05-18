import * as React from 'react';

import * as util from '@recomp/utility/common';

interface ParagraphProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

export const Paragraph = (props: ParagraphProps) => {
  props = util.structureUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...paragraphProps } = props;

  return <p {...paragraphProps} />;
};

const defaultProps: ParagraphProps = {
  className: 'recomp-paragraph',
};

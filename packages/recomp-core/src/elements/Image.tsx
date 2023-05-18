import * as React from 'react';

import * as util from '@recomp/utility/common';

interface ImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export const Image = (props: ImageProps) => {
  props = util.structureUnion(defaultProps, props);
  return <img {...props} />;
};

const defaultProps: ImageProps = {
  className: 'recomp-image',
};

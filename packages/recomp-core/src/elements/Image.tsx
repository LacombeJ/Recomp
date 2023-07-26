import * as React from 'react';

import { propUnion } from '@recomp/props';

interface ImageProps
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {}

export const Image = (props: ImageProps) => {
  props = propUnion(defaultProps, props);
  return <img {...props} />;
};

const defaultProps: ImageProps = {
  className: 'recomp-image',
};

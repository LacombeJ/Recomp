import * as React from 'react';

import { propUnion } from '@recomp/props';

interface VideoProps
  extends React.DetailedHTMLProps<
    React.IframeHTMLAttributes<HTMLIFrameElement>,
    HTMLIFrameElement
  > {}

export const Video = (props: VideoProps) => {
  props = propUnion(defaultProps, props);

  return <iframe {...props} />;
};

const defaultProps: VideoProps = {
  className: 'recomp-video',
  width: '600px',
  height: '400px',
  frameBorder: '0',
  allow: 'autoplay; encrypted-media',
  allowFullScreen: true,
  title: 'video',
};

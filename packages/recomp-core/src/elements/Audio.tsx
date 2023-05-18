import * as React from 'react';

import * as util from '@recomp/utility/common';

interface AudioProps
  extends React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  > {
  className?: string;
  style?: React.CSSProperties;
}

export const Audio = (props: AudioProps) => {
  props = util.structureUnion(defaultProps, props);

  const { className, style, src, ...audioProps } = props;

  return (
    <div className={props.className} style={style}>
      <audio {...audioProps}>{src ? <source src={src}></source> : null}</audio>
    </div>
  );
};

const defaultProps: AudioProps = {
  className: 'recomp-audio',
  controls: true,
};

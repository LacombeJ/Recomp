import * as React from 'react';

import * as util from '@recomp/utility/common';

interface EmojiProps {
  className?: string;
  style?: React.CSSProperties;
  animated?: boolean;
  children?: string;
}

const Emoji = (props: EmojiProps) => {
  props = util.structureUnion(defaultProps, props);
  const { className, style } = props;

  if (props.animated) {
    const skypeAnimated = toSkypeAnimated[props.children];
    if (skypeAnimated) {
      return (
        <img className={className} style={style} src={skypeAnimated}></img>
      );
    }
  }
  return (
    <span className={className} style={style}>
      {props.children}
    </span>
  );
};

const defaultProps = {
  className: 'recomp-emoji',
};

const toSkypeAnimated: { [key: string]: string } = {
  '🤩': 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/star-struck_1f929.png',
  '😭': 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/loudly-crying-face_1f62d.png',
  '💪': 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/flexed-biceps_1f4aa.png',
  '🐒': 'https://emojipedia-us.s3.amazonaws.com/source/skype/289/monkey_1f412.png',
};

export default Emoji;

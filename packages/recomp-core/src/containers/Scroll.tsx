import * as React from 'react';

import * as util from '@recomp/utility/common';

import { Stack } from './Stack';

interface ScrollProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  scroll?: ScrollDirection;
  scrollPolicy?: ScrollPolicy;
}

type ScrollDirection = 'x' | 'y' | 'xy';
type ScrollPolicy = 'scroll' | 'auto' | 'overlay' | 'none';

export const Scroll = (props: ScrollProps) => {
  props = util.propUnion(defaultProps, props);

  const { className, style } = props;

  return (
    <div className={className} style={style}>
      <Stack direction="vertical">
        <Stack.Item
          size="x"
          className={props.innerClassName}
          style={props.innerStyle}
          scroll={props.scroll}
          scrollPolicy={props.scrollPolicy}
        >
          {props.children}
        </Stack.Item>
      </Stack>
    </div>
  );
};

const defaultProps: ScrollProps = {
  className: 'recomp-scroll',
  innerClassName: 'inner',
  scroll: 'xy',
  scrollPolicy: 'auto',
};

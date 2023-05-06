import * as React from 'react';

import Stack from '../elements/Stack';

interface ScrollPaneProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  scroll?: Scroll;
  scrollPolicy?: ScrollPolicy;
}

type Scroll = 'x' | 'y' | 'xy';
type ScrollPolicy = 'scroll' | 'auto' | 'overlay' | 'none';

const ScrollPane = (props: ScrollPaneProps) => {
  props = { ...defaultProps, ...props };

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

const defaultProps: ScrollPaneProps = {
  className: '',
  innerClassName: '',
  scroll: 'xy',
  scrollPolicy: 'auto',
};

export default ScrollPane;

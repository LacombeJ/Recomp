import * as React from 'react';

import katex from 'katex';

import 'katex/src/katex.less';

import * as util from '@recomp/utility/common';

interface KatexProps {
  className?: string;
  style?: React.CSSProperties;
  display?: 'inline' | 'block';
  margin?: string | number;
  size?: 'nano' | 'tiny' | 'small' | 'normal' | 'big' | 'large' | 'huge';
  nlbreak?: boolean;
  children?: string;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
}

const Katex = (props: KatexProps) => {
  props = util.structureUnion(defaultProps, props);

  // const {children, display, size, margin, nlbreak} = props;
  let text = props.children;

  if (props.nlbreak) {
    text = text.replace(/\r?\n/g, '\\\\\n');
  }

  const html = katex.renderToString(text, {
    throwOnError: false,
    trust: false,
    displayMode: props.display === 'block',
  });

  const className = util.classnames({
    [props.className]: true,
    math: true,
    'katex-display': props.display === 'block',
    'katex-inline': props.display === 'inline',
    [props.size]: true,
  });

  const style = {
    ...props.style,
    marginBottom: props.margin,
    marginTop: props.margin,
  };

  props.children = 'x';
  const Component =
    props.display === 'inline'
      ? (props: any) => <span {...props}></span>
      : (props: any) => <div {...props}></div>;

  return (
    <Component
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    ></Component>
  );
};

const defaultProps: KatexProps = {
  className: 'recomp-katex',
  display: 'block',
  size: 'normal',
  margin: '16px',
  nlbreak: true,
};

export default Katex;

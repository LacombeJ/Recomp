import * as React from 'react';

import * as util from '@recomp/utility/common';

interface TextProps {
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  weight?: string;
  color?: string;
  b?: boolean;
  bold?: boolean;
  strong?: boolean;
  u?: boolean;
  underline?: boolean;
  i?: boolean;
  italic?: boolean;
  em?: boolean;
  emphasis?: boolean;
  strike?: boolean;
  delete?: boolean;
  code?: boolean;
  keyCode?: boolean;
  ellipsis?: boolean;
  children?: React.ReactNode;
}

const Text = (props: TextProps) => {
  props = util.structureUnion(defaultProps, props);

  const { style } = props;

  const className = util.classnames({
    [props.className]: true,
    keyCode: props.keyCode,
  });

  if (props.size) {
    style.fontSize = props.size;
  }
  if (props.weight) {
    style.fontWeight = props.weight;
  }
  if (props.color) {
    style.color = props.color;
  }

  const omPropTagMap = util.selectAllFromKeys(props, propTagMap);
  const omTagMap = util.selectAllFromValues(omPropTagMap, tagMap);
  const tags = Object.values(omTagMap);

  const wrapAll = (node: React.ReactNode, fnList: JSX.Element[]) => {
    let res = node;
    fnList.forEach((Component: any) => {
      res = <Component>{res}</Component>;
    });
    return res;
  };

  return (
    <span className={className} style={style}>
      {wrapAll(props.children, tags)}
    </span>
  );
};

const defaultProps: TextProps = {
  className: 'recomp-text',
  size: null,
  weight: null,
  color: null,
  b: false,
  bold: false,
  strong: false,
  u: false,
  underline: false,
  i: false,
  italic: false,
  em: false,
  emphasis: false,
  strike: false,
  delete: false,
  code: false,
  keyCode: false,
  ellipsis: false,
};

const tagMap = {
  b: (props: any) => <b {...props} />,
  strong: (props: any) => <strong {...props} />,
  u: (props: any) => <u {...props} />,
  i: (props: any) => <i {...props} />,
  em: (props: any) => <em {...props} />,
  del: (props: any) => <del {...props} />,
  code: (props: any) => <code {...props} />,
};

const propTagMap = {
  b: 'b',
  bold: 'b',
  strong: 'strong',
  u: 'u',
  underline: 'u',
  i: 'i',
  italic: 'i',
  em: 'em',
  emphasis: 'em',
  strike: 'del',
  del: 'del',
  code: 'code',
};

export default Text;

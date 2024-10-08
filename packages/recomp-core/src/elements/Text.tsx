import * as React from 'react';

import { classnamesEXP } from '@recomp/classnames';
import {
  propUnion,
  selectAllFromKeys,
  selectAllFromValues,
} from '@recomp/props';

interface TextProps {
  className?: string;
  classNames?: {
    tag?: string;
  };
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
  children?: React.ReactNode;
}

export const Text = (props: TextProps) => {
  props = propUnion(defaultProps, props);

  const style = {
    ...props.style,
  };

  const className = classnamesEXP(
    [props.className, true],
    ['keyCode', props.keyCode]
  );

  if (props.size) {
    style.fontSize = props.size;
  }
  if (props.weight) {
    style.fontWeight = props.weight;
  }
  if (props.color) {
    style.color = props.color;
  }

  const omPropTagMap = selectAllFromKeys(props, propTagMap);
  const omTagMap = selectAllFromValues(omPropTagMap, tagMap);
  const tags = Object.values(omTagMap);

  const wrapAll = (node: React.ReactNode, fnList: JSX.Element[]) => {
    let res = node;
    fnList.forEach((Component: any) => {
      res = <Component className={props.classNames?.tag}>{res}</Component>;
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
  classNames: {
    tag: 'tag',
  },
  style: {},
  size: undefined,
  weight: undefined,
  color: undefined,
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

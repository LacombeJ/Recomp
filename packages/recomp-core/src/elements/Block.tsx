import * as React from 'react';

import * as util from '@recomp/utility/common';

import { useNestedProps } from '@recomp/hooks';
import { NestBreak } from '../fragments/NestBreak';

interface BlockProps {
  className?: string;
  classNames?: {
    level?: string;
    solid?: string;
  };
  style?: React.CSSProperties;
  solid?: boolean;
  level?: number;
  onClick?: (e: any) => any;
  setRef?: any;
  children?: React.ReactNode;
}

export const Block = (props: BlockProps) => {
  props = util.structureUnion(defaultProps, props);

  const { setRef: _0, style } = props;
  const className = util.classnames({
    [props.className]: true,
    [`${props.classNames.level}-${props.level + 1}`]: true,
    [props.classNames.solid]: props.solid,
  });

  const [nest] = useNestedProps((child: any) => {
    if (child && child.type && child.type.identifier === NestBreak.identifier) {
      return { break: true };
    }
    if (child && child.type && child.type.identifier === Block.identifier) {
      return {
        props: {
          level: (props.level + 1) % 4,
        },
      };
    }
  });

  const handleClick = (e: any) => {
    props.onClick(e);
  };

  return (
    <div
      className={className}
      style={style}
      onClick={handleClick}
      ref={props.setRef}
    >
      {nest(props.children)}
    </div>
  );
};
Block.identifier = 'recomp-block';

const defaultProps: BlockProps = {
  className: 'recomp-block',
  classNames: {
    level: 'level',
    solid: 'solid',
  },
  style: {},
  solid: false,
  level: 0,
  onClick: () => {},
  setRef: null,
};

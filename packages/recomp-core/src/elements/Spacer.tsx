import * as React from 'react';

import * as util from '@recomp/utility/common';

interface SpacerProps {
  className?: string;
  style?: React.CSSProperties;
  direction: 'vertical' | 'horizontal';
  size?: number;
  children?: React.ReactNode;
}

const Spacer = (props: SpacerProps) => {
  props = util.structureUnion(defaultProps, props);
  const { className } = props;

  const style = {
    ...props.style,
  }

  if (props.direction === 'vertical') {
    style.height = `${props.size}px`;
  } else {
    style.width = `${props.size}px`;
  }

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};

const defaultProps: SpacerProps = {
  className: 'recomp-spacer',
  style: {},
  direction: 'vertical',
  size: 50,
};

export default Spacer;

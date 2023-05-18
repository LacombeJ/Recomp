import * as React from 'react';

import * as util from '@recomp/utility/common';
import { usePress } from '@recomp/hooks';

interface OverlayProps {
  className?: string;
  classNames?: {
    inner: string;
    container: string;
    tint: string;
    blur: string;
  }
  style?: React.CSSProperties,
  enabled?: boolean;
  tint?: boolean;
  blur?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  children?: React.ReactNode;
};

const Overlay = (props: OverlayProps) => {
  props = util.structureUnion(defaultProps, props);

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.tint]: props.tint,
    [props.classNames.blur]: props.blur,
  });

  const [handleMouseHown, handleMouseUp, handleLeave] = usePress((e) => {
    props.onClick?.(e);
  })

  if (!props.enabled) {
    return null;
  }

  return (
    <div className={className} style={props.style}>
      <div className={props.classNames.inner}>
        <div
          className={props.classNames.container}
          onMouseDown={handleMouseHown}
          onMouseUp={handleMouseUp}
          onMouseOut={handleLeave}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
};

const defaultProps: OverlayProps = {
  className: 'recomp-overlay',
  classNames: {
    inner: 'inner',
    container: 'container',
    tint: 'tint',
    blur: 'blur',
  },
};

export default Overlay;

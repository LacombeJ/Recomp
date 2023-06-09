import * as React from 'react';

import * as util from '@recomp/utility/common';
import { usePress, useTimeout } from '@recomp/hooks';

interface OverlayProps {
  className?: string;
  classNames?: {
    container?: string;
    tint?: string;
    blur?: string;
    animated?: string;
  };
  style?: React.CSSProperties;
  enabled?: boolean;
  animated?: boolean;
  tint?: boolean;
  blur?: boolean;
  onClick?: (e: React.MouseEvent) => any;
  onContextMenu?: (e: React.MouseEvent) => any;
  children?: React.ReactNode;
}

export const Overlay = (props: OverlayProps) => {
  props = util.propUnion(defaultProps, props);

  // Visibility set for animation
  const [visible, setVisible] = React.useState(props.enabled);

  const fadeOut = useTimeout(300);

  React.useEffect(() => {
    if (props.animated) {
      if (visible && !props.enabled) {
        // Begin fade out
        fadeOut.begin(() => {
          setVisible(false);
        });
      } else if (!visible && props.enabled) {
        // Begin fade in
        setVisible(true);
      }
    } else {
      setVisible(props.enabled);
    }
  }, [props.enabled]);

  const classToggle = (visible && props.enabled) || !props.animated;

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.animated]: props.animated,
    [props.classNames.tint]: props.tint && classToggle,
    [props.classNames.blur]: props.blur && classToggle,
  });

  const [handleMouseDown, handleMouseUp, handleLeave] = usePress((e) => {
    props.onClick?.(e);
  });

  if (!visible && !props.enabled) {
    return null;
  }

  return (
    <div className={className} style={props.style}>
      <div
        className={props.classNames.container}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseOut={handleLeave}
        onContextMenu={props.onContextMenu}
      >
        {props.enabled ? props.children : null}
      </div>
    </div>
  );
};

const defaultProps: OverlayProps = {
  className: 'recomp-overlay',
  classNames: {
    container: 'container',
    tint: 'tint',
    blur: 'blur',
    animated: 'animated',
  },
};

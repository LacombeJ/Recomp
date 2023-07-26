import * as React from 'react';

import { propUnion } from '@recomp/props';
import { Rect, useMeasure } from '@recomp/hooks';

interface PopoverProps {
  className?: string;
  classNames?: {
    container?: string;
  };
  style?: React.CSSProperties;
  containerStyle?: React.CSSProperties;
  visible?: boolean;
  position?: { x: number; y: number };
  margin?: number;
  children?: React.ReactNode;
  setContainerRef?: (element: HTMLDivElement) => any;
}

export const Popover = (props: PopoverProps) => {
  props = propUnion(defaultProps, props);

  if (!props.visible) {
    return null;
  }

  const containerPosition: React.CSSProperties = {
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
  };

  const containerMargin: React.CSSProperties = {
    marginTop: `${props.margin}px`,
  };

  const containerStyle = {
    ...props.containerStyle,
    ...containerPosition,
    ...containerMargin,
  };

  return (
    <div className={props.className} style={props.style}>
      <div
        className={props.classNames.container}
        style={containerStyle}
        ref={props.setContainerRef}
      >
        {props.children}
      </div>
    </div>
  );
};

const defaultProps: PopoverProps = {
  className: 'recomp-popover',
  classNames: {
    container: 'container',
  },
  position: { x: 0, y: 0 },
  margin: 6,
};

// ----------------------------------------------------------------------------

/**
 * Hook that provides data to handle popovers
 */
export const usePopover = () => {
  const [visible, setVisible] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  const [setAnchorRef, anchorMeasure] = useMeasure();

  const containerRef = React.useRef<HTMLElement>();

  /** Set this so that popover does not disappear if this element retains focus */
  const focusableRef = React.useRef<HTMLElement>();

  const setContainerRef = React.useCallback((element: HTMLElement) => {
    containerRef.current = element;
  }, []);
  const setFocusableRef = React.useCallback((element: HTMLElement) => {
    focusableRef.current = element;
  }, []);

  React.useEffect(() => {
    setPosition({
      x: anchorMeasure.clientRect.left,
      y: anchorMeasure.clientRect.bottom,
    });
    setDimensions({
      width: anchorMeasure.clientRect.width,
      height: anchorMeasure.clientRect.height,
    });
  }, clientRectDepArray(anchorMeasure.clientRect));

  React.useEffect(() => {
    if (visible) {
      const handleMouseDown: EventListener = (event: MouseEvent) => {
        if (event.target !== focusableRef.current) {
          if (containerRef.current) {
            if (!mouseInsideElement(event, containerRef.current)) {
              if (focusableRef.current) {
                if (mouseInsideElement(event, focusableRef.current)) {
                  return;
                }
              }
              setVisible(false);
            }
          }
        }
      };

      document.addEventListener('mousedown', handleMouseDown, {});
      return () => {
        document.removeEventListener('mousedown', handleMouseDown, {});
      };
    }
  }, [visible]);

  return {
    visible,
    setVisible,
    setContainerRef,
    setAnchorRef,
    setFocusableRef,
    position,
    dimensions,
  };
};

const mouseInsideElement = (event: MouseEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const insidePopover =
    rect.top <= event.clientY &&
    event.clientY <= rect.top + rect.height &&
    rect.left <= event.clientX &&
    event.clientX <= rect.left + rect.width;
  return insidePopover;
};

const clientRectDepArray = (rect: Rect) => {
  return [
    rect.x,
    rect.y,
    rect.width,
    rect.height,
    rect.left,
    rect.right,
    rect.bottom,
    rect.top,
  ];
};

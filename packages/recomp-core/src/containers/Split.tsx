import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';
import * as szu from '@recomp/size';

import { useInteract, useMeasure } from '@recomp/hooks';
import { isElement } from '../utility/util';

export interface SplitProps {
  className?: string;
  classNames?: {
    resizer?: string;
    vertical?: string;
    horizontal?: string;
    resizing?: string;
  };
  style?: React.CSSProperties;
  split?: Direction;
  orientation?: Orientation;
  size?: string | number;
  view?: View;
  resizable?: boolean;
  onResizeStart?: () => any;
  onResize?: (size: string) => any;
  onResizeEnd?: () => any;
  children?: React.ReactNode;
}

/**
 * In a Vertical split, components are positioned top/bottom,
 * in a Horizontal split components are positioned left/right
 */
export type Direction = 'vertical' | 'horizontal';

/**
 * If view is 'split', both items are shown and can be resized via resizer/splitter.
 * Otherwise, components take up a whole page and is not resizable.
 * If view is 'first', then only the top or left component is shown.
 * If view is 'second', then only the bottom or right component is shown.
 */
export type View = 'split' | 'first' | 'second';

/**
 * If Orientation is set to "first", then size set and onResize callback is set to the
 * first item, otherwise it is set to the "second" item.
 */
export type Orientation = 'first' | 'second';

export const Split = (props: SplitProps) => {
  props = propUnion(defaultProps, props);

  const nodeRef: React.MutableRefObject<HTMLDivElement> = React.useRef();
  const [setMeasureRef, measureResult] = useMeasure();

  const handleRef = (element: HTMLDivElement) => {
    nodeRef.current = element;
    setMeasureRef(element);
  };

  const [first, second] = React.useMemo(
    () => getSplit(props.children),
    [props.children]
  );

  const label = szu.boundaryLabel(props.split);

  const style: React.CSSProperties = {
    ...props.style,
    flexDirection: label.stack,
  };

  const [size, setSize] = React.useState<string | number>(null);
  const [resizing, setResizing] = React.useState(false);

  const className = classnames({
    [props.className]: true,
    [props.classNames.resizing]: resizing,
    [props.classNames.vertical]: props.split === 'vertical',
    [props.classNames.horizontal]: props.split === 'horizontal',
  });

  // An issue seen is when resizing window, split can get adjusted outside
  // expected min/max range. An attempted fix like listening to size changes
  // and calling performOnResize but with target pos instead of mouse pos
  // did not work since on initialization, client rect can vary during layout
  // and size could be inproperly adjusted before layout.
  // TODO: find a solution for this, maybe considering snap states, possible
  // ignoring callbacks like onResize when adjusting

  const handleMouseUp = () => {
    unsubscribeMouseUp();
    unsubscribeMouseMove();
    props.onResizeEnd?.();
    setResizing(false);
  };

  const handleMouseMove = (event: MouseEvent) => {
    event.preventDefault();
    performOnResize(event.clientX, event.clientY);
  };

  const [
    subscribeMouseUp,
    subscribeMouseMove,
    unsubscribeMouseUp,
    unsubscribeMouseMove,
  ] = useInteract(handleMouseUp, handleMouseMove);

  const handleResizerDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    performOnResizeStart();
  };

  const performOnResizeStart = () => {
    if (!props.resizable) {
      return;
    }

    subscribeMouseUp();
    subscribeMouseMove();

    props.onResizeStart?.();
    setResizing(true);
  };

  const performOnResize = (clientX: number, clientY: number) => {
    const rect = measureResult.clientRect;
    const offsets = szu.offsets(clientX, clientY, rect);

    const snapLeft = !!first.props.snapFrom;
    const snapRight = !!second.props.snapFrom;

    const containerSize = rect[label.size];
    const cursorOffset = offsets[label.pos];

    const rbound = szu.resizeBoundary(
      containerSize,
      first.props.minSize,
      first.props.maxSize,
      second.props.minSize,
      second.props.maxSize
    );

    const snapbound = szu.snapBoundary(
      containerSize,
      first.props.snapFrom,
      second.props.snapFrom
    );

    // position of mouse clipped to size bounds
    const target = szu.targetSize(
      containerSize,
      cursorOffset,
      rbound.min,
      rbound.max
    );

    // position of mouse clipped to snap bounds
    const snaptarget = szu.targetSize(
      containerSize,
      cursorOffset,
      snapbound.min,
      snapbound.max
    );

    const snapTo = szu.snapBoundary(
      containerSize,
      first.props.snapTo,
      second.props.snapTo
    );
    const snapToLeft = szu.toSize(snapTo.min, '%', containerSize);
    const snapToRight = szu.toSize(snapTo.max, '%', containerSize);

    let actualTarget = target;

    // determining midpoint, with a gap of of 10% wide to control snapping

    if (snapLeft && cursorOffset < snapbound.min) {
      // Left snapping around midway point between snapTo.min and snapbound.min
      if (cursorOffset < 0.45 * snapTo.min + snapbound.min * 0.55) {
        actualTarget = snapToLeft;
      } else if (cursorOffset > 0.55 * snapTo.min + snapbound.min * 0.45) {
        actualTarget = snaptarget;
      }
    }

    if (snapRight && cursorOffset > snapbound.max) {
      // Right snapping around midway point between snapbound.max and snapTo.max
      if (cursorOffset > 0.45 * snapTo.max + 0.55 * snapbound.max) {
        actualTarget = snapToRight;
      } else if (cursorOffset < 0.55 * snapTo.max + 0.55 * snapbound.max) {
        actualTarget = snaptarget;
      }
    }

    props.onResize?.(
      String(orientedSize(actualTarget, props.orientation, containerSize))
    );

    if (props.size === null) {
      setSize(actualTarget);
    }
  };

  const renderItem = (
    item: React.ReactElement,
    index: number,
    actualSize: string | number,
    fullSize: number,
    view: View
  ) => {
    if (index === 0) {
      const itemProps: SplitItemProps = {
        direction: props.split,
      };
      if (view === 'second') {
        itemProps.minSize = 0;
      }
      itemProps.size = actualSize;
      return React.cloneElement(item, itemProps);
    } else {
      const itemProps: SplitItemProps = {
        direction: props.split,
      };
      if (view === 'first') {
        itemProps.minSize = 0;
      }
      if (fullSize) {
        // Sometimes fullSize is null, not sure why
        // Set remaining size: 100% - actualSize
        // If we only use percentages, we wouldn't need to use "fullSize"
        itemProps.size = szu.sizeInverse(fullSize, actualSize);
      }

      // itemProps.fill = true;
      return React.cloneElement(item, itemProps);
    }
  };

  if (!size) {
    // TODO fix this. We should be able to get the size inverse of item(1)
    // has the property default size
    const defaultSize = getDefaultSize(first, second);
    setSize(defaultSize.size);
  }

  let fullSize = 0;
  if (nodeRef.current) {
    const rect = measureResult.clientRect;
    fullSize = rect[label.size];
  }

  const orientedPropSize = orientedSize(
    props.size,
    props.orientation,
    fullSize
  );
  let actualSize = props.size === null ? size : orientedPropSize;
  if (fullSize > 0 && props.view !== 'split') {
    actualSize = props.view === 'first' ? '100%' : 0;
  }

  return (
    <div
      style={{
        inset: '0px',
        position: 'absolute',
        overflow: 'hidden',
      }}
    >
      <div className={className} style={style} ref={handleRef}>
        {renderItem(first, 0, actualSize, fullSize, props.view)}
        {props.view === 'split' ? (
          <Resizer
            className={props.classNames.resizer}
            onMouseDown={handleResizerDown}
          ></Resizer>
        ) : null}
        {renderItem(second, 1, actualSize, fullSize, props.view)}
      </div>
    </div>
  );
};

const defaultProps: SplitProps = {
  className: 'recomp-split',
  classNames: {
    resizer: 'resizer',
    horizontal: 'horizontal',
    vertical: 'vertical',
    resizing: 'resizing',
  },
  split: 'horizontal',
  size: null,
  resizable: true,
  orientation: 'first',
  view: 'split',
};

const getSplit = (
  children: React.ReactNode
): [React.ReactElement<SplitItemProps>, React.ReactElement<SplitItemProps>] => {
  const items: [React.ReactElement, React.ReactElement] = [
    undefined,
    undefined,
  ];
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length !== 2) {
    throw new Error('Number of split items is not equal to 2');
  }
  const item0 = childrenArray[0];
  const item1 = childrenArray[1];
  if (!isElement(item0)) {
    throw new Error('First split item is not a react element');
  }
  if (!isElement(item1)) {
    throw new Error('Second split item is not a react element');
  }
  items[0] = item0;
  items[1] = item1;
  return items;
};

const getDefaultSize = (
  first: React.ReactElement<SplitItemProps>,
  second: React.ReactElement<SplitItemProps>
): { size: string | number; position: Orientation } => {
  if (first.props.defaultSize) {
    return { size: first.props.defaultSize, position: 'first' };
  } else if (second.props.defaultSize) {
    return { size: second.props.defaultSize, position: 'second' };
  } else {
    return { size: '50%', position: 'first' };
  }
};

const orientedSize = (
  size: string | number,
  orientation: Orientation,
  container: number
) => {
  if (size === null) {
    return null;
  }
  if (orientation === 'first') {
    return size;
  } else {
    return szu.sizeInverse(container, size);
  }
};

// ----------------------------------------------------------------------------

interface SplitItemProps {
  className?: string;
  style?: React.CSSProperties;
  direction?: 'vertical' | 'horizontal';
  fill?: boolean;
  size?: string | number;
  minSize?: string | number;
  maxSize?: string | number;
  snapFrom?: string | number;
  snapTo?: string | number;
  defaultSize?: string | number;
  onSetRef?: () => any;
  children?: React.ReactNode;
}

const Item = (props: SplitItemProps) => {
  props = propUnion(itemDefaultProps, props);

  const className = props.className;

  const boundaryStyle = szu.boundarySizeStyle(
    props.direction,
    props.minSize,
    props.maxSize
  );
  const sizeStyle = szu.sizeStyle(props.direction, props.size);
  const style = {
    ...itemDefaultStyle,
    ...boundaryStyle,
    ...sizeStyle,
    ...props.style,
  };

  if (props.fill) {
    style.flex = '1 0 auto';
  }

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};

const itemDefaultStyle: React.CSSProperties = {
  display: 'flex',
  flex: '0 0 auto',
  position: 'relative',
  outline: 'none',
};

const itemDefaultProps: SplitItemProps = {
  className: 'item',
  onSetRef: () => {},
};

// ----------------------------------------------------------------------------

interface ResizerProps {
  className: string;
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
}

const Resizer = (props: ResizerProps) => {
  return (
    <div className={props.className} onMouseDown={props.onMouseDown}></div>
  );
};

// ----------------------------------------------------------------------------

Split.Item = Item;

import * as React from 'react';

import { useInteract } from '@recomp/hooks';
import * as util from '@recomp/utility/common';
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
  size?: string | number;
  view?: View;
  resizable?: boolean;
  onResizeStart?: () => any;
  onResize?: (event: { size: string }) => any;
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

export const Split = (props: SplitProps) => {
  props = util.propUnion(defaultProps, props);

  const nodeRef: React.Ref<HTMLDivElement> = React.useRef();

  const [first, second] = React.useMemo(
    () => getSplit(props.children),
    [props.children]
  );

  const label = util.boundaryLabel(util.flipDirection(props.split));

  const style: React.CSSProperties = {
    ...props.style,
    flexDirection: label.stack,
  };

  const [size, setSize] = React.useState<string | number>(null);
  const [sizeFocus, setSizeFocus] = React.useState<'first' | 'second'>('first');
  const [resizing, setResizing] = React.useState(false);

  const className = util.classnames({
    [props.className]: true,
    [props.classNames.resizing]: resizing,
    [props.classNames.vertical]: props.split === 'vertical',
    [props.classNames.horizontal]: props.split === 'horizontal',
  });

  const handleMouseUp = () => {
    unsubscribeMouseUp();
    unsubscribeMouseMove();
    props.onResizeEnd();
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

    props.onResizeStart();
    setResizing(true);
  };

  const performOnResize = (clientX: number, clientY: number) => {
    const rect = nodeRef.current.getBoundingClientRect();
    const offsets = util.offsets(clientX, clientY, rect);

    const minSnapLeft = !!first.props.minSnap;
    const minSnapRight = !!second.props.minSnap;
    const maxSnapLeft = !!first.props.maxSnap;
    const maxSnapRight = !!second.props.maxSnap;

    const minSnap = minSnapLeft || maxSnapRight; // first-side snapping
    const maxSnap = maxSnapLeft || minSnapRight; // second-side snapping

    const containerSize = rect[label.size];
    const cursorOffset = offsets[label.pos];

    const rbound = util.resizeBoundary(
      containerSize,
      first.props.minSize,
      first.props.maxSize,
      second.props.minSize,
      second.props.maxSize
    );

    const snapbound = util.resizeBoundary(
      containerSize,
      first.props.minSnap,
      first.props.maxSnap,
      second.props.minSnap,
      second.props.maxSnap
    );

    // position of mouse clipped to size bounds
    const target = util.targetSize(
      containerSize,
      cursorOffset,
      rbound.min,
      rbound.max
    );

    // position of mouse clipped to snap bounds
    const snaptarget = util.targetSize(
      containerSize,
      cursorOffset,
      snapbound.min,
      snapbound.max
    );

    let actualTarget = target;

    if (minSnap || maxSnap) {
      if (minSnap && cursorOffset < snapbound.min) {
        // Left snapping around midway point between (0) and snapbound.min
        if (cursorOffset < snapbound.min * 0.45) {
          actualTarget = '0%';
        } else if (cursorOffset > snapbound.min * 0.55) {
          actualTarget = snaptarget;
        } else {
          return;
        }
      }

      if (maxSnap && cursorOffset > snapbound.max) {
        // Right snapping around midway point between snapbound.max and container
        if (cursorOffset > 0.45 * containerSize + 0.55 * snapbound.max) {
          actualTarget = '100%';
        } else if (cursorOffset < 0.55 * containerSize + 0.55 * snapbound.max) {
          actualTarget = snaptarget;
        } else {
          return;
        }
      }
    }

    props.onResize({
      size: actualTarget,
    });

    if (props.size === null) {
      setSize(actualTarget);
      setSizeFocus('first');
    }
  };

  const renderItem = (
    item: React.ReactElement,
    index: number,
    actualSize: string | number,
    view: View,
    sizeFocus: 'first' | 'second'
  ) => {
    if (index === 0) {
      const itemProps: SplitItemProps = {
        direction: props.split,
      };
      if (view === 'second') {
        itemProps.minSize = 0;
      }
      if (sizeFocus === 'first') {
        itemProps.size = actualSize;
      } else {
        itemProps.fill = true;
      }
      return React.cloneElement(item, itemProps);
    } else {
      const itemProps: SplitItemProps = {
        direction: props.split,
      };
      if (view === 'first') {
        itemProps.minSize = 0;
      }
      if (sizeFocus === 'second') {
        itemProps.size = actualSize;
      } else {
        itemProps.fill = true;
      }
      return React.cloneElement(item, itemProps);
    }
  };

  if (!size) {
    // TODO fix this. We should be able to get the size inverse of item(1)
    // has the property default size
    const defaultSize = getDefaultSize(first, second);
    setSize(defaultSize.size);
    setSizeFocus(defaultSize.position);
  }

  let fullSize = 0;
  if (nodeRef.current) {
    const rect: any = nodeRef.current.getBoundingClientRect();
    fullSize = rect[label.size];
  }

  let actualSize = props.size === null ? size : props.size;
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
      <div className={className} style={style} ref={nodeRef}>
        {renderItem(first, 0, actualSize, props.view, sizeFocus)}
        {props.view === 'split' ? (
          <Resizer
            className={props.classNames.resizer}
            onMouseDown={handleResizerDown}
          ></Resizer>
        ) : null}
        {renderItem(second, 1, actualSize, props.view, sizeFocus)}
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
  split: 'vertical',
  size: null,
  resizable: true,
  view: 'split',
  onResizeStart: () => {},
  onResize: () => {},
  onResizeEnd: () => {},
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
): { size: string | number; position: 'first' | 'second' } => {
  if (first.props.defaultSize) {
    return { size: first.props.defaultSize, position: 'first' };
  } else if (second.props.defaultSize) {
    return { size: second.props.defaultSize, position: 'second' };
  } else {
    return { size: '50%', position: 'first' };
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
  minSnap?: string | number;
  maxSnap?: string | number;
  defaultSize?: string | number;
  onSetRef?: () => any;
  children?: React.ReactNode;
}

const Item = (props: SplitItemProps) => {
  props = util.propUnion(itemDefaultProps, props);

  const className = props.className;

  const boundaryStyle = util.boundarySizeStyle(
    util.flipDirection(props.direction),
    props.minSize,
    props.maxSize
  );
  const sizeStyle = util.sizeStyle(
    util.flipDirection(props.direction),
    props.size
  );
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

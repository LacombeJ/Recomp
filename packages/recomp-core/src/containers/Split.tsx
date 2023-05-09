import * as React from 'react';

import { useInteract } from '@recomp/hooks';
import * as util from '@recomp/utility/common';
import { isElement } from '../utility/util';

interface SplitProps {
  classNames?: {
    split?: string;
    resizer?: {
      resizer?: string;
      vertical?: string;
      horizontal?: string;
      center?: string;
      resizing?: string;
    };
  };
  style?: React.CSSProperties;
  split?: 'vertical' | 'horizontal';
  size?: string | number;
  view?: 'both' | 'left' | 'right' | 'top' | 'bottom';
  resizeEnabled?: boolean;
  onResizeStart?: () => any;
  onResize?: (event: { size: string }) => any;
  onResizeEnd?: () => any;
  children?: React.ReactNode;
}

const Split = (props: SplitProps) => {
  props = util.structureUnion(defaultProps, props);

  const nodeRef: React.Ref<HTMLDivElement> = React.useRef();

  const contents = getSplitContents(props.children);
  const label = util.boundaryLabel(util.flipDirection(props.split));

  const className = props.classNames.split;
  const style: React.CSSProperties = {
    ...props.style,
  };
  (style as any).flexDirection = label.stack;

  const view = getViewIndex(props.view);

  const [size, setSize] = React.useState(null);
  const [resizing, setResizing] = React.useState(false);

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
    if (!props.resizeEnabled) {
      return;
    }

    subscribeMouseUp();
    subscribeMouseMove();

    props.onResizeStart();
    setResizing(true);
  };

  const performOnResize = (clientX: number, clientY: number) => {
    const rect: any = nodeRef.current.getBoundingClientRect();
    const offsets: any = util.offsets(clientX, clientY, rect);

    const minSnap = !!contents.items[0].props.minSnap;
    const maxSnap = !!contents.items[1].props.maxSnap;

    const rbound = util.resizeBoundary(
      rect[label.size],
      contents.items[0].props.minSize,
      contents.items[0].props.maxSize,
      contents.items[1].props.minSize,
      contents.items[1].props.maxSize
    );

    const snapbound = util.resizeBoundary(
      rect[label.size],
      contents.items[0].props.minSnap,
      contents.items[0].props.maxSnap,
      contents.items[1].props.minSnap,
      contents.items[1].props.maxSnap
    );

    const target = util.targetSize(
      rect[label.size],
      offsets[label.pos],
      rbound.min,
      rbound.max
    );

    const snaptarget = util.targetSize(
      rect[label.size],
      offsets[label.pos],
      snapbound.min,
      snapbound.max
    );

    let actualTarget = target;

    if (minSnap || maxSnap) {
      const tpx = Number(util.convertSizeToPixels(target, rect[label.size]));
      const spx = Number(
        util.convertSizeToPixels(snaptarget, rect[label.size])
      );

      if (minSnap && tpx < rbound.max) {
        if (tpx < spx) {
          if (tpx < spx * 0.45) {
            actualTarget = '0%';
          } else if (tpx > spx * 0.55) {
            actualTarget = snaptarget;
          } else {
            return;
          }
        }
      }
      if (maxSnap && tpx > rbound.min) {
        if (tpx > spx) {
          if (tpx > spx * 0.55) {
            actualTarget = '100%';
          } else if (tpx < spx * 0.45) {
            actualTarget = snaptarget;
          } else {
            return;
          }
        }
      }
    }

    props.onResize({
      size: actualTarget,
    });

    if (props.size === null) {
      setSize(actualTarget);
    }
  };

  const renderItem = (
    item: React.ReactElement,
    index: number,
    actualSize: any,
    view: number
  ) => {
    if (index === 0) {
      const itemProps: any = {
        direction: props.split,
        size: actualSize,
      };
      if (view === 1) {
        itemProps.minSize = 0;
      }
      return React.cloneElement(item, itemProps);
    } else {
      const itemProps: any = {
        direction: props.split,
        fill: true,
      };
      if (view === 0) {
        itemProps.minSize = 0;
      }
      return React.cloneElement(item, itemProps);
    }
  };

  if (!size) {
    // TODO fix this. We should be able to get the size inverse of item(1)
    // has the property default size
    setSize(getDefaultSize(contents.items));
  }

  let fullSize = 0;
  if (nodeRef.current) {
    const rect: any = nodeRef.current.getBoundingClientRect();
    fullSize = rect[label.size];
  }

  let actualSize = props.size === null ? size : props.size;
  if (fullSize > 0 && view !== -1) {
    actualSize = view === 0 ? '100%' : 0;
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
        {renderItem(contents.items[0], 0, actualSize, view)}
        {view === -1 ? (
          <Resizer
            classNames={props.classNames.resizer}
            split={props.split}
            onMouseDown={handleResizerDown}
            resizing={resizing}
          ></Resizer>
        ) : null}
        {renderItem(contents.items[1], 1, actualSize, view)}
        {contents.rest}
      </div>
    </div>
  );
};

const defaultProps: SplitProps = {
  classNames: {
    split: 'recomp-split',
  },
  split: 'vertical',
  size: null,
  resizeEnabled: true,
  view: 'both',
  onResizeStart: () => {},
  onResize: () => {},
  onResizeEnd: () => {},
};

const getViewIndex = (view: string) => {
  if (view === 'left' || view === 'top') {
    return 0;
  }
  if (view === 'right' || view === 'bottom') {
    return 1;
  }
  return -1;
};

const getSplitContents = (children: React.ReactNode) => {
  const res: {
    items: [React.ReactElement, React.ReactElement];
    rest: React.ReactElement[];
  } = {
    items: [undefined, undefined],
    rest: [],
  };
  let index = 0;
  React.Children.toArray(children).forEach((child) => {
    if (isElement(child)) {
      if (child.type === Split.Item) {
        res.items[index] = child;
        index += 1;
      } else {
        res.rest.push(child);
      }
    }
  });
  if (res.items.length !== 2) {
    throw new Error('Number of split items is not equal to 2');
  }
  return res;
};

const getDefaultSize = (items: [React.ReactElement, React.ReactElement]) => {
  if (items[1].props.defaultSize) {
    return items[1].props.defaultSize;
  } else if (items[0].props.defaultSize) {
    return items[0].props.defaultSize;
  } else {
    return '50%';
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
  props = util.structureUnion(itemDefaultProps, props);

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
  className: '',
  onSetRef: () => {},
};

// ----------------------------------------------------------------------------

interface ResizerProps {
  classNames?: {
    resizer?: string;
    vertical?: string;
    horizontal?: string;
    center?: string;
    resizing?: string;
  };
  style?: React.CSSProperties;
  split?: 'center' | 'vertical' | 'horizontal';
  resizing?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Resizer = (props: ResizerProps) => {
  props = util.structureUnion(resizerDefaultProps, props);

  if (props.classNames) {
    props.classNames = {
      ...resizerDefaultProps.classNames,
      ...props.classNames,
    };
  }
  const classNames = { ...props.classNames };
  const className = util.classnames({
    [classNames.resizer]: true,
    [classNames.vertical]: props.split === 'vertical',
    [classNames.horizontal]: props.split === 'horizontal',
    [classNames.center]: props.split === 'center',
    [classNames.resizing]: props.resizing,
  });
  const style = {
    ...props.style,
  };
  return (
    <div
      className={className}
      style={style}
      onMouseDown={props.onMouseDown}
      onClick={props.onClick}
      onDoubleClick={props.onDoubleClick}
    ></div>
  );
};

const resizerDefaultProps: ResizerProps = {
  classNames: {
    resizer: 'recomp-resizer',
    vertical: 'vertical',
    horizontal: 'horizontal',
    center: 'center',
    resizing: 'resizing',
  },
  resizing: false,
};

// ----------------------------------------------------------------------------

Split.Item = Item;
Split.Resizer = Resizer;

export default Split;

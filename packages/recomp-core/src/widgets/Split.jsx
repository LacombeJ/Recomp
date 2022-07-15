import React from "react";
import PropTypes from "prop-types";
import stylePropType from "react-style-proptype";

import { useInteract } from "@recomp/hooks";
import * as util from "@recomp/utils";
const { classnames } = util;

/**
 * @param {Split.defaultProps} props
 */
const Split = (props) => {
  const nodeRef = React.useRef();

  const contents = getSplitContents(props.children);
  const label = util.boundaryLabel(util.flipDirection(props.split));

  const className = props.classNames.split;
  const style = {
    ...props.style,
    flexDirection: label.stack,
  };

  const view = getViewIndex(props.view);

  const [size, setSize] = React.useState(null);
  const [resizing, setResizing] = React.useState(false);

  const handleMouseUp = (event) => {
    unsubscribeMouseUp();
    unsubscribeMouseMove();
    props.onResizeEnd();
    setResizing(false);
  };

  const handleMouseMove = (event) => {
    event.preventDefault();
    performOnResize(event.clientX, event.clientY);
  };

  const [
    subscribeMouseUp,
    subscribeMouseMove,
    unsubscribeMouseUp,
    unsubscribeMouseMove,
  ] = useInteract(handleMouseUp, handleMouseMove);

  const handleResizerDown = (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    performOnResizeStart(event.clientX, event.clientY);
  };

  const performOnResizeStart = (clientX, clientY) => {
    if (!props.resizeEnabled) {
      return;
    }

    subscribeMouseUp();
    subscribeMouseMove();

    props.onResizeStart();
    setResizing(true);
  };

  const performOnResize = (clientX, clientY) => {
    const rect = nodeRef.current.getBoundingClientRect();
    const offsets = util.offsets(clientX, clientY, rect);

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
            actualTarget = "0%";
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
            actualTarget = "100%";
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

  const renderItem = (item, index, actualSize, view) => {
    if (index === 0) {
      const itemProps = {};
      itemProps.direction = props.split;
      itemProps.size = actualSize;
      if (view === 1) {
        itemProps.minSize = 0;
      }
      return React.cloneElement(item, itemProps);
    } else {
      const itemProps = {};
      itemProps.direction = props.split;
      itemProps.fill = true;
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
    const rect = nodeRef.current.getBoundingClientRect();
    fullSize = rect[label.size];
  }

  let actualSize = props.size === null ? size : props.size;
  if (fullSize > 0 && view !== -1) {
    actualSize = view === 0 ? "100%" : 0;
  }

  return (
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
  );
};

Split.propTypes = {
  classNames: PropTypes.shape({
    split: PropTypes.string,
    resizer: PropTypes.shape({
      resizer: PropTypes.string,
      vertical: PropTypes.string,
      horizontal: PropTypes.string,
      center: PropTypes.string,
    }),
  }),
  style: stylePropType,
  split: PropTypes.oneOf(["vertical", "horizontal"]).isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  view: PropTypes.oneOf(["both", "left", "right", "top", "bottom", 0, 1]),
  resizeEnabled: PropTypes.bool,
  onResizeStart: PropTypes.func,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
};

Split.defaultProps = {
  classNames: {
    split: "recomp-split",
  },
  style: {},
  // split: 'vertical', // isRequired
  size: null,
  resizeEnabled: true,
  view: "both",
  onResizeStart: () => {},
  onResize: () => {},
  onResizeEnd: () => {},
};

const getViewIndex = (view) => {
  if (view === "left" || view === "top") {
    return 0;
  }
  if (view === "right" || view === "bottom") {
    return 1;
  }
  return -1;
};

const getSplitContents = (children) => {
  const res = {
    items: [],
    rest: [],
  };
  React.Children.toArray(children).forEach((child) => {
    if (child.type === Split.Item) {
      res.items.push(child);
    } else {
      res.rest.push(child);
    }
  });
  if (res.items.length !== 2) {
    throw new Error("Number of split items is not equal to 2");
  }
  return res;
};

const getDefaultSize = (items) => {
  if (items[1].props.defaultSize) {
    return items[1].props.defaultSize;
  } else if (items[0].props.defaultSize) {
    return items[0].props.defaultSize;
  } else {
    return "50%";
  }
};

// ----------------------------------------------------------------------------

const Item = (props) => {
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
    ...Item.defaultStyle,
    ...boundaryStyle,
    ...sizeStyle,
    ...props.style,
  };

  if (props.fill) {
    style.flex = "1 0 auto";
  }

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};

Item.defaultStyle = {
  display: "flex",
  flex: "0 0 auto",
  position: "relative",
  outline: "none",
};

Item.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
  direction: PropTypes.oneOf(["vertical", "horizontal"]),
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minSnap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxSnap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSetRef: PropTypes.func,
};

Item.defaultProps = {
  className: "",
  style: Item.defaultStyle,
  // direction: undefined,
  // size: undefined,
  // minSize: undefined,
  // maxSize: undefined,
  // minSnap: undefined,
  // maxSnap: undefined,
  // defaultSize: undefined,
  onSetRef: () => {},
};

// ----------------------------------------------------------------------------

const defaultClassNames = {
  resizer: "recomp-resizer",
  vertical: "vertical",
  horizontal: "horizontal",
  center: "center",
  resizing: "resizing",
};

const Resizer = (props) => {
  const classNames = {
    ...defaultClassNames,
    ...props.classNames,
  };
  const className = classnames({
    [classNames.resizer]: true,
    [classNames.vertical]: props.split === "vertical",
    [classNames.horizontal]: props.split === "horizontal",
    [classNames.center]: props.split === "center",
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

Resizer.propTypes = {
  classNames: PropTypes.shape({
    resizer: PropTypes.string,
    vertical: PropTypes.string,
    horizontal: PropTypes.string,
    center: PropTypes.string,
    resizing: PropTypes.string,
  }),
  style: stylePropType,
  resizing: PropTypes.bool,
  onMouseDown: PropTypes.func,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
};

Resizer.defaultProps = {
  classNames: defaultClassNames,
  style: {},
  resizing: false,
  onMouseDown: () => {},
  onClick: () => {},
  onDoubleClick: () => {},
};

// ----------------------------------------------------------------------------

Split.Item = Item;
Split.Resizer = Resizer;

export default Split;

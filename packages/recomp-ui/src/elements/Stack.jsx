import React from "react";
import PropTypes from "prop-types";
import stylePropType from "react-style-proptype";

import * as util from "@recomp/utils";
const classnames = util.classnames;

/**
 * @param {Stack.defaultProps} props
 */
const Stack = (props) => {
  return (
    <React.Fragment>
      {childrenWithSettings(props.children, props.direction)}
    </React.Fragment>
  );
};

Stack.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(["horizontal", "vertical"]).isRequired,
};

Stack.defaultProps = {
  /** @type {import('react').ReactNode} */
  children: undefined, // isRequired
  /** @type {('horizontal'|'vertical')} */
  direction: "vertical", // isRequired
};

// ----------------------------------------------------------------------------

/**
 * @param {Stack.Item.defaultProps} props
 */
Stack.Item = (props) => {
  const isVertical = props.settings.orientation === "vertical";

  const classes = classnames({
    row: isVertical,
    col: !isVertical,
    [props.scrollPolicy]: props.scrollPolicy !== "none",
    [props.scroll]: true,
  });

  const style = {
    ...stackStyle(props),
    ...util.defineStyle(classes, stackItemStyleDef),
  };

  return (
    <div className={props.className} style={style}>
      {props.children}
    </div>
  );
};

Stack.Item.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: stylePropType,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  scroll: PropTypes.oneOf(["x", "y", "xy"]),
  scrollPolicy: PropTypes.oneOf(["scroll", "auto", "overlay", "none"]),
  settings: PropTypes.object,
};

Stack.Item.defaultProps = {
  /** @type {import('react').ReactNode} */
  children: undefined,
  className: "",
  /** @type {React.CSSProperties} */
  style: {},
  /** @type {String|Number} */
  size: undefined,
  /** @type {('x'|'y'|'xy')} */
  scroll: "xy",
  /** @type {('scroll'|'auto'|'overlay'|'none')} */
  scrollPolicy: "auto",
  /** @type {ChildSettings} */
  settings: undefined,
};

// ----------------------------------------------------------------------------

const stackItemStyleDef = {
  overflow: "hidden",
  position: "absolute",

  ".row": {
    left: "0px",
    right: "0px",
  },
  ".col": {
    top: "0px",
    bottom: "0px",
  },

  // auto overflow
  ".auto.x": {
    overflowX: "auto",
  },
  ".auto.y": {
    overflowY: "auto",
  },
  ".auto.xy": {
    overflow: "auto",
  },

  // scroll overflow
  ".scroll.x": {
    overflowX: "scroll",
  },
  ".scroll.y": {
    overflowY: "scroll",
  },
  ".scroll.xy": {
    overflow: "scroll",
  },

  // overlay overflow
  ".overlay.x": {
    overflowX: "overlay",
  },
  ".overlay.y": {
    overflowY: "overlay",
  },
  ".overlay.xy": {
    overflow: "overlay",
  },
};

/**
 * @param {Stack.Item.defaultProps} props
 */
const stackStyle = (props) => {
  /** @type {React.CSSProperties} */
  const style = {};

  const label = util.boundaryLabel(props.settings.orientation);

  if (props.settings.anchor === "top") {
    style[label.front] = props.settings.offset + "px";
    style[label.size] = props.size + "px";
  } else if (props.settings.anchor === "bot") {
    style[label.back] = props.settings.offset + "px";
    style[label.size] = props.size + "px";
  } else {
    style[label.front] = props.settings.paddingTop + "px";
    style[label.back] = props.settings.paddingBot + "px";
  }

  return style;
};

/**
 * @param {import('react').ReactNode} children
 * @param {'horizontal'|'vertical'} orientation
 */
const childrenWithSettings = (children, orientation) => {
  children = React.Children.toArray(children).filter((child) => {
    return child.type === Stack.Item;
  });

  const childrenSettings = React.Children.map(children, (_) => {
    return {
      anchor: "top",
      offset: "0",
      paddingTop: "0",
      paddingBot: "0",
      orientation,
    };
  });

  let centerIndex = -1;
  let top = 0;
  let bot = 0;
  let topIndex = 0;
  let botIndex = 0;

  // Set top anchor
  for (topIndex = 0; topIndex < children.length; ++topIndex) {
    let size = children[topIndex].props.size;

    if (size === "x") {
      centerIndex = topIndex;
      break;
    } else {
      childrenSettings[topIndex].anchor = "top";
      childrenSettings[topIndex].offset = top.toString();
      top += parseInt(size);
    }
  }

  // Set bot anchor
  for (botIndex = children.length - 1; botIndex > topIndex; --botIndex) {
    let size = children[botIndex].props.size;

    if (size === "x") {
      break;
    } else {
      childrenSettings[botIndex].anchor = "bot";
      childrenSettings[botIndex].offset = bot.toString();
      bot += parseInt(size);
    }
  }

  // Set center anchor
  if (centerIndex !== -1) {
    childrenSettings[centerIndex].anchor = "none";
    childrenSettings[centerIndex].offset = "0";
    childrenSettings[centerIndex].paddingTop = top;
    childrenSettings[centerIndex].paddingBot = bot;
  }

  return React.Children.map(children, (child, i) => {
    return React.cloneElement(child, {
      settings: childrenSettings[i],
    });
  });
};

/**
 * @typedef {{
 *   anchor: string
 *   offset: string
 *   paddingTop: number
 *   paddingBot: number
 *   orientation: 'horizontal'|'vertical'
 * }} ChildSettings
 */

export default Stack;

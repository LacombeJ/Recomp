import React from "react";
import PropTypes from "prop-types";
import stylePropType from "react-style-proptype";

import Stack from "../elements/Stack";

/** @param {ScrollPane.defaultProps} props */
const ScrollPane = (props) => {
  const { className, style } = props;

  return (
    <div className={className} style={style}>
      <Stack direction="vertical">
        <Stack.Item
          size="x"
          className={props.innerClassName}
          style={props.innerStyle}
          scroll={props.scroll}
          scrollPolicy={props.scrollPolicy}
        >
          {props.children}
        </Stack.Item>
      </Stack>
    </div>
  );
};

ScrollPane.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: stylePropType,
  innerClassName: PropTypes.string,
  innerStyle: stylePropType,
  scroll: PropTypes.oneOf(["x", "y", "xy"]),
  scrollPolicy: PropTypes.oneOf(["scroll", "auto", "overlay", "none"]),
};

ScrollPane.defaultProps = {
  /** @type {import('react').ReactNode} */
  children: undefined,
  className: "",
  /** @type {React.CSSProperties} */
  style: {},
  innerClassName: "",
  /** @type {React.CSSProperties} */
  innerStyle: {},
  /** @type {('x'|'y'|'xy')} */
  scroll: "xy",
  /** @type {('scroll'|'auto'|'overlay'|'none')} */
  scrollPolicy: "auto",
};

export default ScrollPane;

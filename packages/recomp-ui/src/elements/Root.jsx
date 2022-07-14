import React from "react";
import PropTypes from "prop-types";

import { useEventListener } from "@recomp/hooks";

/**
 * @param {Root.defaultProps} props
 */
const Root = (props) => {
  useEventListener(document, "resize", props.onResize);

  React.useEffect(() => {
    props.onMount({ mount: true });
    return () => {
      props.onUnmount({ mount: false });
    };
  });

  return (
    <div className={props.className} style={props.style}>
      <div className={props.innerClassName} style={props.innerStyle}>
        {props.children}
      </div>
    </div>
  );
};

Root.propTypes = {
  classNames: PropTypes.shape({
    root: PropTypes.string,
    sub: PropTypes.string,
  }),
  style: PropTypes.object,
  onMount: PropTypes.func,
  onUnmount: PropTypes.func,
  onResize: PropTypes.func,
};

Root.defaultProps = {
  className: "recomp-root",
  /** @type {React.StyleHTMLAttributes} */
  style: {},
  innerClassName: "sub",
  /** @type {React.StyleHTMLAttributes} */
  innerStyle: {},
  onMount: () => {},
  onUnmount: () => {},
  onResize: () => {},
};

export default Root;

import React from "react";
import PropTypes from "prop-types";

import { useTimeout } from "@recomp/hooks";

/**
 * @param {Delay.defaultProps} props
 */
const Delay = (props) => {
  const [show, setShow] = React.useState(false);

  const handleDelayComplete = () => {
    setShow(true);
    props.onComplete();
  };

  useTimeout(props.ms, handleDelayComplete);

  if (show && props.children) {
    return props.children;
  } else {
    return null;
  }
};

Delay.propTypes = {
  ms: PropTypes.number,
  onComplete: PropTypes.func,
};

Delay.defaultProps = {
  ms: 1000,
  onComplete: () => {},
};

export default Delay;

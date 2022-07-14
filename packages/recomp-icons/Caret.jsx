import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

const Caret = (props) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 50 50"
      width="10"
      height="10"
      transform={`rotate(${props.rotation})`}
      style={props.style}
      fill="currentColor"
    >
      <path d="M3.91 7.81L42.97 7.81L42.97 14.06L3.91 14.06L3.91 7.81Z"></path>
      <path d="M37.5 14.06L42.97 14.06L42.97 46.88L37.5 46.88L37.5 14.06Z"></path>
    </svg>
  );
};

Caret.propTypes = {
  style: stylePropType,
  rotation: PropTypes.number,
};

Caret.defaultProps = {
  style: {},
  rotation: 0,
};

export default Caret;

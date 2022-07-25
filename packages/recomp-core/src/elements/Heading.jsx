import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

/**
 * @param {Heading.defaultProps} props
 */
const Heading = (props) => {
  const className = props.className;
  const style = props.style;
  const HeadingElement = headingMap[props.level];
  return (
    <HeadingElement className={className} style={style}>
      {props.children}
    </HeadingElement>
  );
};

Heading.propTypes = {
  className: PropTypes.string,
  style: stylePropType,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
};

Heading.defaultProps = {
  className: 'recomp-heading',
  style: {},
  level: 1,
};

const headingMap = {
  1: (props) => <h1 {...props} />,
  2: (props) => <h2 {...props} />,
  3: (props) => <h3 {...props} />,
  4: (props) => <h4 {...props} />,
  5: (props) => <h5 {...props} />,
  6: (props) => <h6 {...props} />,
};

export default Heading;

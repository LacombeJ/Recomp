import React from 'react';
import PropTypes from 'prop-types';

/**
 * @param {Page.defaultProps} props
 */
const Page = (props) => {
  const ActivePage = props.pages[props.page];

  if (ActivePage) {
    if (props.pageProps) {
      return React.cloneElement(ActivePage, props.pageProps);
    } else {
      return <ActivePage></ActivePage>;
    }
  } else {
    const PlaceHolderPage = props.placeHolder;
    if (PlaceHolderPage) {
      return <props.placeHolder></props.placeHolder>;
    }
    if (props.require) {
      throw new Error('Page not found: ' + props.page);
    }
  }

  return null;
};

Page.propTypes = {
  page: PropTypes.any.isRequired,
  pages: PropTypes.object.isRequired,
  pageProps: PropTypes.any,
  require: PropTypes.bool,
  placeHolder: PropTypes.any,
};

Page.defaultProps = {
  // page: null,
  // pages: null,
  pageProps: null,
  require: false,
  placeHolder: null,
};

export default Page;

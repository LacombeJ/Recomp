import * as React from 'react';

import * as util from '@recomp/utils';

interface PageProps {
  page: any;
  pages: { [key: string]: any };
  pageProps?: any;
  require?: boolean;
  placeHolder?: any;
}

/**
 * @param {Page.defaultProps} props
 */
const Page = (props: PageProps) => {
  props = util.structureUnion(defaultProps, props);

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

const defaultProps: any = {
  require: false,
  pageProps: null,
  placeHolder: null,
};

export default Page;

import * as React from 'react';

import * as util from '@recomp/utility/common';

interface LinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {}

const Link = (props: LinkProps) => {
  props = util.structureUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...linkProps } = props;

  return <a {...linkProps} />;
};

const defaultProps: LinkProps = {
  className: 'recomp-link',
};

export default Link;

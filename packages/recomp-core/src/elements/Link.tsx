import * as React from 'react';

import { propUnion } from '@recomp/props';

interface LinkProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {}

export const Link = (props: LinkProps) => {
  props = propUnion(defaultProps, props);

  const { dangerouslySetInnerHTML: _0, ...linkProps } = props;

  return <a {...linkProps} />;
};

const defaultProps: LinkProps = {
  className: 'recomp-link',
};

import * as React from 'react';

import { isNullOrWhitespace } from '@recomp/props';

export const ZeroWidth = () => {
  // ZERO_WIDTH_SPACE
  // For properly adjusting sizes of elements like buttons, checkboxes, etc
  // This can be used as a placeholder if no-text is provided to an element but
  // height of element should still be a size as if there was text
  return <React.Fragment>&#8203;</React.Fragment>;
};

/**
 * Returns the react node if valid node or non empty string, or a ZeroWidth space fragment if the
 * node is null, or an empty / whitespace string
 */
export const nonempty = (node: React.ReactNode) => {
  if (isNullOrWhitespace(node)) {
    return <ZeroWidth />;
  } else {
    return node;
  }
};

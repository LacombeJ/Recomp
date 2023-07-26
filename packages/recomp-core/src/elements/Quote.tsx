import * as React from 'react';

import { propUnion } from '@recomp/props';

interface QuoteProps {
  className?: string;
  classNames?: {
    quote?: string;
    cite?: string;
  };
  style?: React.CSSProperties;
  by?: string;
  children?: React.ReactNode;
}

export const Quote = (props: QuoteProps) => {
  props = propUnion(defaultProps, props);

  return (
    <div className={props.className} style={props.style}>
      <blockquote className={props.classNames.quote}>
        {props.children}
      </blockquote>
      <cite className={props.classNames.cite}>{props.by}</cite>
    </div>
  );
};

const defaultProps: QuoteProps = {
  className: 'recomp-quote',
  classNames: {
    quote: 'quote',
    cite: 'cite',
  },
  by: 'unknown',
};

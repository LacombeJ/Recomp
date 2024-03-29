// Fragment used to break/reset nesting rules (like in blocks or lists)

import * as React from 'react';

interface NestBreakProps {
  children?: React.ReactNode;
}

export const NestBreak = (props: NestBreakProps) => {
  return props.children;
};
NestBreak.identifier = 'recomp-nest-break';

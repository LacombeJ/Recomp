import * as React from 'react';

export const isElement = (
  child:
    | string
    | number
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | React.ReactFragment
    | React.ReactPortal
): child is React.ReactElement => {
  return (
    (child as React.ReactElement).props !== undefined &&
    (child as React.ReactElement).type !== undefined &&
    (child as React.ReactElement).key !== undefined
  );
};

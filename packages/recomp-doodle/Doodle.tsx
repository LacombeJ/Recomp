import * as React from 'react';

import 'css-doodle';

interface DoodleProps {
  grid?: string;
  use?: string;
  seed?: string;
  children?: string;
  setRef?: (element: DoodleElement) => void;
}

export const Doodle = (props: DoodleProps) => {
  const doodleRef: React.MutableRefObject<DoodleElement> = React.useRef();

  const handleSetRef = (element: DoodleElement) => {
    doodleRef.current = element;
    props.setRef?.(element);
  };

  React.useEffect(() => {
    if (doodleRef.current) {
      doodleRef.current.update(props.children);
    }
  }, [props.children]);

  return <css-doodle ref={handleSetRef} {...props}></css-doodle>;
};

export interface DoodleElement extends HTMLElement {
  grid: string;
  use: string;
  seed: string;
  update: (style?: string) => void;
  export: (options?: ExportOptions) => void;
}

export interface ExportOptions {
  scale?: number;
  detail?: boolean;
  download?: boolean;
  name?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'css-doodle': {
        grid?: string;
        use?: string;
        seed?: string;
        children?: string;
        ref: React.LegacyRef<DoodleElement>;
      };
    }
  }
}

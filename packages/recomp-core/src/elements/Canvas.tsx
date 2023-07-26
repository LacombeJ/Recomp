import * as React from 'react';

import { propUnion } from '@recomp/props';

interface CanvasProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  render?: (ctx: CanvasRenderingContext2D) => any;
}

export const Canvas = (props: CanvasProps) => {
  props = propUnion(defaultProps, props);
  const {
    render,
    ref: _0,
    dangerouslySetInnerHTML: _1,
    ...canvasProps
  } = props;

  const canvasRef: React.MutableRefObject<HTMLCanvasElement> = React.useRef();

  React.useEffect(() => {
    // Perform provided rendering on context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    render(ctx);
  }, [render]);

  return <canvas ref={canvasRef} {...canvasProps} />;
};

const defaultProps: CanvasProps = {
  className: 'recomp-canvas',
  width: 300,
  height: 150,
  render: () => {},
};

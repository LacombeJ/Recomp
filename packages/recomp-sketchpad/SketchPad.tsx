import * as React from 'react';

import * as util from '@recomp/utility/common';
import { Canvas } from '@recomp/core';
import { useStateOrProps } from '@recomp/hooks';

import { Point, State, initState, pushStroke, pushPoint } from './StrokeData';

interface SketchPadProps {
  className?: string;
  style?: React.CSSProperties;
  state?: State;
  readOnly?: boolean;
  width?: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  onUpdateState?: (state: State) => any;
  onStrokeComplete?: (state: State) => any;
  children?: React.ReactNode;
}

const SketchPad = (props: SketchPadProps) => {
  props = util.structureUnion(defaultProps, props);
  const { className, style } = props;

  const [sketching, setSketching] = React.useState(false);

  const [strokeState, setStrokeState] = useStateOrProps(
    initState(),
    props.state,
    (state: State) => {
      props.onUpdateState(state);
    },
    !!props.state
  );

  const render = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;

    const { width, height } = canvas;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    if (props.backgroundColor) {
      ctx.fillStyle = props.backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Render strokes
    for (let i = 0; i < strokeState.strokes.length; i++) {
      const stroke = strokeState.strokes[i];

      ctx.beginPath();
      for (let j = 0; j < stroke.points.length - 1; j++) {
        const start = normalizePoint(stroke.points[j], width, height);
        const end = normalizePoint(stroke.points[j + 1], width, height);

        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
      }
      ctx.closePath();

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width; // TODO normalize?
      ctx.lineJoin = stroke.join;
      ctx.lineCap = stroke.cap;
      ctx.miterLimit = stroke.miterLimit;

      ctx.stroke();
    }
  };

  const startStroke = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    if (props.readOnly) return;

    setSketching(true);

    const point = getCursor(e);
    setStrokeState(
      pushStroke(strokeState, {
        points: [point],
        color: props.color,
      })
    );
  };

  const moveStroke = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    if (!sketching) return;

    const point = getCursor(e);
    const updatedState = pushPoint(strokeState, point);
    setStrokeState(updatedState);
  };

  const endStroke = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    if (!sketching) return;
    setSketching(false);

    const point = getCursor(e);
    const updatedState = pushPoint(strokeState, point);
    setStrokeState(updatedState);

    props.onStrokeComplete(updatedState);
  };

  return (
    <Canvas
      className={className}
      style={style}
      width={props.width}
      height={props.height}
      render={render}
      onMouseDown={startStroke}
      onMouseMove={moveStroke}
      onMouseUp={endStroke}
    ></Canvas>
  );
};

const defaultProps: SketchPadProps = {
  className: 'recomp-sketchpad',
  state: undefined,
  width: 300,
  height: 300,
  color: 'black',
  backgroundColor: 'white',
  onUpdateState: () => {},
  onStrokeComplete: () => {},
};

// ----------------------------------------------------------------------------

const getCursor = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
  const canvas = e.target as HTMLCanvasElement;
  const rect = canvas.getBoundingClientRect();

  const x = (e.clientX - rect.left) / canvas.width;
  const y = (e.clientY - rect.top) / canvas.height;

  return { x, y };
};

const normalizePoint = (point: Point, width: number, height: number) => {
  return {
    x: point.x * width,
    y: point.y * height,
  };
};

export default SketchPad;

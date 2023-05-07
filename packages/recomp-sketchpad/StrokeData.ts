export interface Stroke {
  points: Point[];
  width?: number;
  color?: string;
  cap?: CanvasLineCap;
  join?: CanvasLineJoin;
  miterLimit?: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface State {
  strokes: Stroke[];
}

export const initState = (): State => {
  return {
    strokes: [],
  };
};

export const pushStroke = (state: State, stroke: Stroke): State => {
  stroke = { ...defaultStroke(), ...stroke };
  return {
    ...state,
    strokes: [
      ...state.strokes,
      {
        ...stroke,
      },
    ],
  };
};

export const pushPoint = (state: State, point: Point) => {
  const newState = {
    ...state,
    strokes: [...state.strokes],
  };
  newState.strokes[newState.strokes.length - 1] = {
    ...newState.strokes[newState.strokes.length - 1],
    points: [...newState.strokes[newState.strokes.length - 1].points, point],
  };
  return newState;
};

const defaultStroke = (): Stroke => {
  return {
    points: [],
    width: 5,
    color: '#000',
    cap: 'round',
    join: 'round',
    miterLimit: 10,
  };
};

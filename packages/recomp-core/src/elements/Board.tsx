import * as React from 'react';

import * as util from '@recomp/utility/common';

interface BoardProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  setRef?: (element: HTMLDivElement) => void;
}

export const Board = (props: BoardProps) => {
  props = util.propUnion(defaultProps, props);
  return (
    <div className={props.className} style={props.style} ref={props.setRef}>
      {props.children}
    </div>
  );
};

const defaultProps: BoardProps = {
  className: 'recomp-board',
};

// ----------------------------------------------------------------------------

Board.Header = (props: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  props = util.propUnion({ className: 'header' }, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

Board.Title = (props: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  props = util.propUnion({ className: 'title' }, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

Board.Control = (props: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  props = util.propUnion({ className: 'control' }, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

Board.Body = (props: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  props = util.propUnion({ className: 'body' }, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

Board.Footer = (props: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  props = util.propUnion({ className: 'footer' }, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

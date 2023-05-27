import * as React from 'react';

import * as util from '@recomp/utility/common';

interface DialogProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Dialog = (props: DialogProps) => {
  props = util.propUnion(defaultProps, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};

const defaultProps: DialogProps = {
  className: 'recomp-dialog',
};

// ----------------------------------------------------------------------------

Dialog.Header = (props: {
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

Dialog.Title = (props: {
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

Dialog.Control = (props: {
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

Dialog.Body = (props: {
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

Dialog.Footer = (props: {
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

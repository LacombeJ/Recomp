import * as React from 'react';

import { classnames, selectClassName } from '@recomp/classnames';
import { propUnion } from '@recomp/props';
import { X } from '@recomp/icons';

export interface AlertProps {
  className?: string;
  classNames?: {
    scrollable?: string;
    content?: string;
    title?: string;
    body?: string;
    icon?: string;
    close?: string;
    variant?: {
      default?: string;
      primary?: string;
      success?: string;
      warn?: string;
      danger?: string;
    };
  };
  style?: React.CSSProperties;
  variant?: 'default' | 'primary' | 'success' | 'warn' | 'danger';
  title?: string;
  icon?: React.ReactNode;
  closeable?: boolean;
  children?: React.ReactNode;
  onClose?: () => any;
}

export const Alert = (props: AlertProps) => {
  props = propUnion(defaultProps, props);

  const className = classnames({
    [props.className]: true,
    ...selectClassName(props.classNames.variant, props.variant),
  });

  return (
    <div className={className} style={props.style}>
      {props.icon ? (
        <div className={props.classNames.icon}>{props.icon}</div>
      ) : null}

      <div className={props.classNames.content}>
        <div className={props.classNames.title}>{props.title}</div>
        <div className={props.classNames.body}>{props.children}</div>
      </div>

      {props.closeable ? (
        <div
          className={props.classNames.close}
          onClick={() => props.onClose?.()}
        >
          <X></X>
        </div>
      ) : null}
    </div>
  );
};

const defaultProps: AlertProps = {
  className: 'recomp-alert',
  classNames: {
    scrollable: 'scrollable',
    content: 'content',
    title: 'title',
    body: 'body',
    icon: 'icon',
    close: 'close',
    variant: {
      default: 'default',
      primary: 'primary',
      success: 'success',
      warn: 'warn',
      danger: 'danger',
    },
  },
  variant: 'default',
};

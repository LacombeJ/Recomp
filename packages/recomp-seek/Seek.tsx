import * as React from 'react';

import { Input } from '@recomp/core';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

interface SeekProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onEscape?: () => any;
  onEnter?: () => any;
  onMove?: (direction: 'down' | 'up') => any;
  setRef?: (element: HTMLInputElement) => void;
}

export const Seek = (props: SeekProps) => {
  props = propUnion(defaultProps, props);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      props.onEscape?.();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      props.onMove?.('up');
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      props.onMove?.('down');
    } else if (event.key === 'Enter') {
      props.onEnter?.();
    }
  };

  return (
    <div className={props.className} style={props.style}>
      <div className="search">
        {props.icon ? <div className="icon">{props.icon}</div> : null}
        <Input
          tabIndex={0}
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          onKeyDown={handleKeyDown}
          setRef={props.setRef}
        ></Input>
      </div>
      <div className="entries">{props.children}</div>
    </div>
  );
};

const defaultProps: SeekProps = {
  className: 'recomp-seek',
  placeholder: 'Search...',
};

// ----------------------------------------------------------------------------

interface ItemProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  selected?: boolean;
  icon?: React.ReactNode;
  onClick?: () => any;
}

const Item = (props: ItemProps) => {
  props = propUnion(itemDefaultProps, props);

  const className = classnames({
    [props.className]: true,
    selected: props.selected,
  });

  return (
    <div className={className} style={props.style} onClick={props.onClick}>
      {props.icon ? <div className="icon">{props.icon}</div> : null}
      <div className="content">{props.children}</div>
    </div>
  );
};

const itemDefaultProps: SeekProps = {
  className: 'item',
};

Seek.Item = Item;

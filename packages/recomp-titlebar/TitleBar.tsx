import * as React from 'react';

import { classnames } from '@recomp/classnames';
import { propUnion } from '@recomp/props';

import {
  Menu,
  MenuGroup,
  menuChildren,
  normalizeMenuElements,
} from '../recomp-menu/Menu';
import { Overlay } from '@recomp/core';
import { Close, Maximize, Minimize } from '@recomp/icons';

interface TitleBarProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  ext?: any;
}

export const TitleBar = (props: TitleBarProps) => {
  props = propUnion(defaultProps, props);

  return (
    <div className={props.className} style={props.style} {...props.ext}>
      {props.children}
    </div>
  );
};

const defaultProps: TitleBarProps = {
  className: 'recomp-titlebar',
  ext: {},
};

// ----------------------------------------------------------------------------

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  ext?: any;
}

const Icon = (props: IconProps) => {
  props = propUnion(IconDefaultProps, props);
  return (
    <div className={props.className} style={props.style} {...props.ext}>
      {props.children}
    </div>
  );
};
TitleBar.Icon = Icon;

const IconDefaultProps: IconProps = {
  className: 'titleicon',
  ext: {},
};

// ----------------------------------------------------------------------------

interface MenuBarProps {
  className?: string;
  classNames?: {
    menuOffset?: string;
    button?: string;
    active?: string;
    highlight?: string;
    label?: string;
    overlay?: string;
  };
  style?: React.CSSProperties;
  model?: MenuGroup[];
  ext?: any;
  onClick?: (id: string) => any;
}

const MenuBar = (props: MenuBarProps) => {
  props = propUnion(menuDefaultProps, props);
  if (props.model) {
    props.model = normalizeMenuElements(props.model) as MenuGroup[];
  }

  const [selected, setSelected] = React.useState<string | null>(null);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });

  const handleButtonClick = (
    id: string,
    position: { x: number; bottom: number }
  ) => {
    setSelected(id);
    setMenuPosition({ x: position.x, y: position.bottom });
  };

  const handleButtonMouseEnter = (
    id: string,
    position: { x: number; bottom: number }
  ) => {
    if (selected) {
      setSelected(id);
      setMenuPosition({ x: position.x, y: position.bottom });
    }
  };

  const handleOverlayClick = () => {
    setSelected(null);
  };

  const menuOffset: React.CSSProperties = {
    left: `${menuPosition.x}px`,
    top: `${menuPosition.y}px`,
  };

  return (
    <React.Fragment>
      <div className={props.className} style={props.style} {...props.ext}>
        {props.model.map((item) => {
          return (
            <Button
              key={item.id}
              className={props.classNames.button}
              classNames={{
                active: props.classNames.active,
                highlight: props.classNames.highlight,
                label: props.classNames.label,
              }}
              active={item.id === selected}
              onClick={(position) => handleButtonClick(item.id, position)}
              onMouseEnter={(position) =>
                handleButtonMouseEnter(item.id, position)
              }
            >
              {item.label}
            </Button>
          );
        })}
      </div>
      {selected !== null ? (
        <Overlay enabled={selected !== null} onClick={handleOverlayClick}>
          <div className={props.classNames.menuOffset} style={menuOffset}>
            <Menu
              key={selected}
              model={menuChildren(props.model, selected)}
              onClick={(id) => {
                props.onClick?.(id);
                setSelected(null);
              }}
            ></Menu>
          </div>
        </Overlay>
      ) : null}
    </React.Fragment>
  );
};
TitleBar.MenuBar = MenuBar;

const menuDefaultProps: MenuBarProps = {
  className: 'menubar',
  classNames: {
    menuOffset: 'menu-offset',
    button: 'button',
    active: 'active',
    highlight: 'highlight',
    label: 'label',
    overlay: 'overlay',
  },
  ext: {},
};

interface ButtonProps {
  className: string;
  classNames: {
    active: string;
    highlight: string;
    label: string;
  };
  active: boolean;
  onClick: (position: { x: number; bottom: number }) => any;
  onMouseEnter: (position: { x: number; bottom: number }) => any;
  children: React.ReactNode;
}

const Button = (props: ButtonProps) => {
  const className = classnames({
    [props.className]: true,
    [props.classNames.active]: props.active,
  });

  const divRef = React.useRef<HTMLDivElement>();

  const handleClick = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      props.onClick({ x: rect.x, bottom: rect.bottom });
    }
  };

  const handleMouseEnter = () => {
    if (divRef.current) {
      const rect = divRef.current.getBoundingClientRect();
      props.onMouseEnter({ x: rect.x, bottom: rect.bottom });
    }
  };

  return (
    <div
      className={className}
      ref={divRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
    >
      <div className={props.classNames.highlight}></div>
      <div className={props.classNames.label}>{props.children}</div>
    </div>
  );
};

// ----------------------------------------------------------------------------

interface HeaderProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  ext?: any;
}

const Header = (props: HeaderProps) => {
  props = propUnion(headerDefaultProps, props);
  return (
    <div className={props.className} style={props.style} {...props.ext}>
      {props.children}
    </div>
  );
};
TitleBar.Header = Header;

const headerDefaultProps: HeaderProps = {
  className: 'header',
  ext: {},
};

// ----------------------------------------------------------------------------

interface ControlBarProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  ext?: any;
}

const ControlBar = (props: ControlBarProps) => {
  props = propUnion(controlBarDefaultProps, props);
  return (
    <div className={props.className} style={props.style} {...props.ext}>
      {props.children}
    </div>
  );
};
TitleBar.ControlBar = ControlBar;

const controlBarDefaultProps: ControlBarProps = {
  className: 'controlbar',
  ext: {},
};

type ControlType = 'minimize' | 'maximize' | 'close' | 'other';

interface ControlButtonProps {
  className?: string;
  style?: React.CSSProperties;
  type: ControlType;
  onClick?: (type: ControlType) => any;
  children?: React.ReactNode;
}

const ControlButton = (props: ControlButtonProps) => {
  props = propUnion(controlButtonDefaultProps, props);

  let className = props.className;

  const handleClick = () => {
    props.onClick?.(props.type);
  };

  if (!props.children) {
    if (props.type === 'minimize') {
      props.children = <Minimize></Minimize>;
    } else if (props.type === 'maximize') {
      props.children = <Maximize></Maximize>;
    } else if (props.type === 'close') {
      className += ' close';
      props.children = <Close></Close>;
    }
  }

  return (
    <div className={className} style={props.style} onClick={handleClick}>
      {props.children}
    </div>
  );
};
TitleBar.ControlButton = ControlButton;

const controlButtonDefaultProps = {
  className: 'button',
};

import * as React from 'react';

import * as util from '@recomp/utility/common';
import { Chevron } from '@recomp/icons';
import {
  Rect,
  useEventListener,
  useMeasure,
  useSize,
  useTimeout,
} from '@recomp/hooks';
import { Overlay } from '@recomp/core';

export type MenuElement = MenuItem | MenuGroup | MenuComponent | MenuSeparator;

export type MenuSeparator = {
  type?: 'separator';
};

export interface MenuItem {
  className?: string;
  classNames?: {
    highlight?: string;
    label?: string;
    icon?: string;
    accelerator?: string;
  };
  style?: React.CSSProperties;
  id: string;
  type?: 'item';
  icon?: React.ReactNode;
  label: React.ReactNode;
  accelerator?: string;
}

export interface MenuGroup {
  className?: string;
  classNames?: {
    highlight?: string;
    label?: string;
    icon?: string;
    caret?: string;
  };
  style?: React.CSSProperties;
  id: string;
  type?: 'group';
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuElement[];
}

export interface MenuComponent {
  type?: 'component';
  component: React.ReactNode;
  id: string;
}

// ----------------------------------------------------------------------------

interface MenuProps {
  className?: string;
  classNames?: {
    overlay?: string;
    offset?: string;
    menu?: string;
  };
  style?: React.CSSProperties;
  model: MenuElement[];
  setMenuRef?: (element: HTMLDivElement) => any;
  onResize?: (width: number, height: number) => any;
  onClick?: (id: string) => any;
}

export const Menu = (props: MenuProps) => {
  props = util.propUnion(defaultProps, props);
  if (props.model) {
    props.model = normalizeMenuElements(props.model);
  }

  const { className, style, ...restProps } = props;

  // The below div element is of size (0), so instead use ref of first submenu
  return (
    <div className={props.className} style={props.style}>
      <SubMenu {...restProps}></SubMenu>
    </div>
  );
};

const defaultProps: MenuProps = {
  className: 'recomp-menu',
  classNames: {
    overlay: 'overlay',
    offset: 'offset',
    menu: 'menu',
  },
  style: {},
  model: [],
};

interface SubMenuProps extends MenuProps {
  id?: string;
  onMouseEnter?: () => any;
  onMouseLeave?: () => any;
  onResize?: (width: number, height: number) => any;
  onClick?: (id: string) => any;
}

export const SubMenu = (props: SubMenuProps) => {
  const submenuCalc = useMenuHoverCalculations();
  const { model, ...restProps } = props;

  // Dimensions to be passed to parent menu
  const menuRef = useSize(({ width, height }) => {
    props.onResize?.(width, height);
  });

  // Will adjust submenu based on position, size, and window dimensions
  const [adjusted, setAdjusted] = React.useState({
    calculated: false,
    x: 0,
    y: 0,
  });
  const intent = submenuCalc.positionIntent;
  const offsetStyle: React.CSSProperties = {
    left: `${adjusted.x}px`,
    top: `${adjusted.y}px`,
    visibility: adjusted.calculated ? 'visible' : 'hidden',
  };

  const handleSubmenuResize = (width: number, height: number) => {
    setAdjusted({
      calculated: true,
      ...util.adjust({
        x: intent.x,
        y: intent.y,
        width,
        height,
      }),
    });
  };

  // recursive callbacks, from bottom-up
  // this is to make sure all ancestor's descendent submenus
  // are closed properly
  const handleDescendentMouseEnter = () => {
    submenuCalc.handleSubmenuMouseEnter();
    props.onMouseEnter?.();
  };
  const handleDescendentMouseLeave = () => {
    submenuCalc.handleSubmenuMouseLeave();
    props.onMouseLeave?.();
  };

  return (
    <React.Fragment>
      <div
        className={props.classNames.menu}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        ref={menuRef}
      >
        {props.model
          ? props.model.map((element, index) => {
              if (element.type === 'separator') {
                return <Separator key={`_separator-${index}`}></Separator>;
              } else if (element.type === 'component') {
                return (
                  <Component key={(element as MenuComponent).id}>
                    {(element as MenuComponent).component}
                  </Component>
                );
              } else if (element.type === 'item') {
                return (
                  <Item
                    key={(element as MenuItem).id}
                    item={element as MenuItem}
                    onClick={props.onClick}
                  ></Item>
                );
              } else if (element.type === 'group') {
                return (
                  <Group
                    key={(element as MenuGroup).id}
                    {...(element as MenuGroup)}
                    onClick={submenuCalc.handleGroupClick}
                    onMouseEnter={submenuCalc.handleGroupMouseEnter}
                    onMouseLeave={submenuCalc.handleGroupMouseLeave}
                  ></Group>
                );
              }
            })
          : null}
      </div>
      {/* The submenu key stops the SubMenu component from preserving state
      betweem two different models */}
      {submenuCalc.active ? (
        <div className={props.classNames.overlay}>
          <div className={props.classNames.offset} style={offsetStyle}>
            <SubMenu
              key={submenuCalc.active}
              model={menuChildren(props.model, submenuCalc.active)}
              {...restProps}
              onMouseEnter={handleDescendentMouseEnter}
              onMouseLeave={handleDescendentMouseLeave}
              onResize={handleSubmenuResize}
            />
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

// ----------------------------------------------------------------------------

interface ItemProps {
  item: MenuItem;
  onClick: (id: string) => any;
}

const Item = (props: ItemProps) => {
  const { item } = props;
  const handleClick = () => {
    props.onClick?.(item.id);
  };
  return (
    <div className={item.className} style={item.style} onClick={handleClick}>
      <div className={item.classNames.highlight}></div>
      <div className={item.classNames.icon}>{item.icon}</div>
      <div className={item.classNames.label}>{item.label}</div>
      <div className={item.classNames.accelerator}>{item.accelerator}</div>
    </div>
  );
};

// ----------------------------------------------------------------------------

interface GroupProps extends MenuGroup {
  onClick: (id: string, rect: Rect) => any;
  onMouseEnter?: (id: string, rect: Rect) => any;
  onMouseLeave?: () => any;
}
const Group = (props: GroupProps) => {
  const [divRef, measureResult] = useMeasure();

  const handleClick = () => {
    props.onClick?.(props.id, measureResult.clientRect);
  };

  const handleMouseEnter = () => {
    props.onMouseEnter?.(props.id, measureResult.clientRect);
  };

  const handleMouseLeave = () => {
    props.onMouseLeave?.();
  };

  return (
    <div
      className={props.className}
      style={props.style}
      ref={divRef}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={props.classNames.highlight}></div>
      <div className={props.classNames.icon}>{props.icon}</div>
      <div className={props.classNames.label}>{props.label}</div>
      <div className={props.classNames.caret}>
        <Chevron></Chevron>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------

interface SeparatorProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Separator = (props: SeparatorProps) => {
  props = util.propUnion(separatorDefaultProps, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};
Menu.Separator = Separator;

const separatorDefaultProps: SeparatorProps = {
  className: 'separator',
};

// ----------------------------------------------------------------------------

interface ComponentProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Component = (props: ComponentProps) => {
  props = util.propUnion(componentDefaultProps, props);
  return (
    <div className={props.className} style={props.style}>
      {props.children}
    </div>
  );
};
const componentDefaultProps: ComponentProps = {
  className: 'component',
};

// ----------------------------------------------------------------------------

interface MenuContextProps {
  className?: string;
  opened: boolean;
  position: {
    x: number;
    y: number;
  };
  model: MenuElement[];
  onClickOutside: () => any;
  onClick?: (id: string) => any;
}

const Context = (props: MenuContextProps) => {
  props = util.propUnion(contextDefaultProps, props);

  const [adjusted, setAdjusted] = React.useState({
    x: 0,
    y: 0,
    calculated: false,
  });
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const menuContainerRef = React.useRef<HTMLDivElement>();

  const handleMenuSize = (width: number, height: number) => {
    setSize({ width, height });
  };

  useEventListener(document, 'mousedown', (e: MouseEvent) => {
    // This is added to ensure that mousedown triggers closes context menu. With this, a
    // new context menu can be opened with a right-click even if one is alread opened. In
    // that scenario, first this will close the current context menu, then after the click,
    // the new menu will be opened
    if (menuContainerRef.current) {
      if (!menuContainerRef.current.contains(e.target as Node)) {
        props.onClickOutside?.();
      }
    }
  });

  const handleOverlayClick = () => {
    props.onClickOutside?.();
  };

  React.useEffect(() => {
    if (!props.opened) {
      // When menu disappears, unset calculated state
      // Doing this fixes flickering when opening/closing menus
      setAdjusted({
        ...adjusted,
        calculated: false,
      });
    }
  }, [props.opened]);

  React.useEffect(() => {
    setAdjusted({
      calculated: true,
      ...util.adjust({
        x: props.position.x,
        y: props.position.y,
        width: size.width,
        height: size.height,
      }),
    });
  }, [props.position, size]);

  const menuOffset: React.CSSProperties = {
    left: `${adjusted.x}px`,
    top: `${adjusted.y}px`,
    visibility: adjusted.calculated ? 'visible' : 'hidden',
  };

  return (
    <Overlay enabled={props.opened} onClick={handleOverlayClick}>
      <div
        className={props.className}
        style={menuOffset}
        ref={menuContainerRef}
      >
        <Menu
          model={props.model}
          onResize={handleMenuSize}
          onClick={props.onClick}
        ></Menu>
      </div>
    </Overlay>
  );
};
Menu.Context = Context;

const contextDefaultProps = {
  className: 'recomp-menu-context',
};

// ----------------------------------------------------------------------------

const useMenuHoverCalculations = () => {
  const [active, setActive] = React.useState<string | null>(null);
  const [recentHover, setRecentHover] = React.useState(false);
  const [hoverRect, setHoverRect] = React.useState<Rect>();

  const hoverTimeout = useTimeout(1500);

  // Time between
  const recentTimeout = useTimeout(1000);

  // Keep submenu on for a little even after mouse leave
  const stickyTimeout = useTimeout(1000);

  const handleGroupClick = (id: string, rect: Rect) => {
    setActive(id);
    setHoverRect(rect);
  };

  const handleGroupMouseEnter = (id: string, rect: Rect) => {
    setHoverRect(rect);
    hoverTimeout.cancel();
    stickyTimeout.cancel();

    if (recentHover) {
      setActive(id);
    } else if (!active) {
      hoverTimeout.begin(() => {
        setActive(id);
      });
    }

    setRecentHover(true);
    recentTimeout.cancel();
  };

  const handleGroupMouseLeave = () => {
    hoverTimeout.cancel();
    recentTimeout.begin(() => {
      setRecentHover(false);
    });
    stickyTimeout.begin(() => {
      setActive(null);
      setRecentHover(false);
    });
  };

  const handleSubmenuMouseEnter = () => {
    hoverTimeout.cancel();
    stickyTimeout.cancel();
    recentTimeout.cancel();
    setRecentHover(true);
  };

  const handleSubmenuMouseLeave = () => {
    hoverTimeout.cancel();
    recentTimeout.begin(() => {
      setRecentHover(false);
    });
    stickyTimeout.begin(() => {
      setActive(null);
      setRecentHover(false);
    });
  };

  const positionIntent = { x: 0, y: 0 };
  if (hoverRect) {
    positionIntent.x = hoverRect.right - 2;
    positionIntent.y = hoverRect.y;
  }

  return {
    handleGroupClick,
    handleGroupMouseEnter,
    handleGroupMouseLeave,
    handleSubmenuMouseEnter,
    handleSubmenuMouseLeave,
    active,
    positionIntent,
  };
};

// ----------------------------------------------------------------------------

const itemDefaultProps = {
  className: 'item',
  classNames: {
    highlight: 'highlight',
    label: 'label',
    icon: 'icon',
    accelerator: 'accelerator',
  },
};

const groupDefaultProps = {
  className: 'group',
  classNames: {
    highlight: 'highlight',
    label: 'label',
    icon: 'icon',
    accelerator: 'accelerator',
    caret: 'caret',
  },
};

export const normalizeMenuElements = (items: any[]): MenuElement[] => {
  const model: MenuElement[] = [];

  for (const item of items) {
    if (item === 'separator' || item.type === 'separator') {
      model.push({ type: 'separator' });
    } else if (item.type === 'component' || item.component) {
      model.push({ type: 'component', id: item.id, component: item.component });
    } else if (item.children) {
      const props = util.propUnion(groupDefaultProps, item);
      model.push({
        ...props,
        type: 'group',
        children: normalizeMenuElements(props.children),
      });
    } else {
      const props = util.propUnion(itemDefaultProps, item);
      model.push({
        ...props,
        type: 'item',
      });
    }
  }

  return model;
};

export const menuChildren = (model: MenuElement[], id: string) => {
  if (id) {
    const group = model.find((element) => {
      return (element as MenuGroup).id === id;
    }) as MenuGroup;
    return group.children;
  } else {
    return [];
  }
};

/** Hook for implementing a context menu by overriding default context menu */
export const useContextMenu = (context: {
  model: (id: string) => MenuElement[];
  onClick?: (id: string) => any;
}) => {
  const model = React.useRef<MenuElement[]>(null);
  const [opened, setOpened] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const override = (id?: string) => (e: React.MouseEvent) => {
    e.preventDefault(); // use this context menu instead of default
    e.stopPropagation(); // so that a parent context menu doesn't appear

    setPosition({ x: e.clientX, y: e.clientY });
    model.current = context.model(id);
    setOpened(true);
  };

  const contextProps = {
    opened,
    model: model.current,
    position,
    onClickOutside: () => setOpened(false),
    onClick: context.onClick,
  };

  return {
    opened,
    setOpened,
    override,
    model: model.current,
    position,
    contextProps,
  };
};

const convertQuickContextToModel = (
  items: QuickContextItem[]
): MenuElement[] => {
  return items.map((item): MenuElement => {
    if (item === 'separator') {
      return { type: 'separator' };
    } else {
      return { type: 'item', id: item.label, label: item.label };
    }
  });
};

export type QuickContextActionItem = { label: string; action: () => void };
export type QuickContextItem = QuickContextActionItem | 'separator';

export const useQuickContextMenu = () => {
  const model = React.useRef<MenuElement[]>(null);
  const quickItems = React.useRef<QuickContextItem[]>(null);

  const [opened, setOpened] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  const override = (items: QuickContextItem[]) => (e: React.MouseEvent) => {
    console.log('override');

    const menu = convertQuickContextToModel(items);
    model.current = menu;
    quickItems.current = items;

    e.preventDefault();
    e.stopPropagation();

    console.log('menu...', menu);

    setPosition({ x: e.clientX, y: e.clientY });

    setOpened(true);
  };

  const handleAction = (id: string) => {
    for (const item of quickItems.current) {
      if (item !== 'separator' && item.label === id) {
        item.action();
        setOpened(false);
        break;
      }
    }
  };

  const contextProps = {
    opened,
    model: model.current,
    position,
    onClickOutside: () => setOpened(false),
    onClick: handleAction,
  };

  return {
    opened,
    setOpened,
    override,
    model: model.current,
    position,
    contextProps,
  };
};

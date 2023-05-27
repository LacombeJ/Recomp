import * as React from 'react';

import * as util from '@recomp/utility/common';
import { Chevron } from '@recomp/icons';
import { Rect, useMeasure, useSize, useTimeout } from '@recomp/hooks';

export type MenuElement = MenuItem | MenuGroup | MenuSeparator;

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
}

export const Menu = (props: MenuProps) => {
  props = util.propUnion(defaultProps, props);
  if (props.model) {
    props.model = normalizeMenuElements(props.model);
  }

  const { className, style, ...restProps } = props;

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
              } else if (element.type === 'item') {
                return (
                  <Item
                    key={(element as MenuItem).id}
                    item={element as MenuItem}
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

const Item = ({ item }: { item: MenuItem }) => {
  return (
    <div className={item.className} style={item.style}>
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
Separator.identifier = 'recomp-menu-separator';
Menu.Separator = Separator;

const separatorDefaultProps: SeparatorProps = {
  className: 'separator',
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

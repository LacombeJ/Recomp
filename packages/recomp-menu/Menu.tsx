import * as React from 'react';

import * as util from '@recomp/utility/common';

type MenuType = 'item' | 'group' | 'separator';

type MenuElement = MenuItem | MenuGroup | MenuSeparator;

type MenuSeparator = {
  type: MenuType;
};

interface MenuItem {
  className?: string;
  classNames?: {
    label?: string;
    icon?: string;
    accelerator?: string;
  };
  style?: React.CSSProperties;
  id: string;
  type: MenuType;
  icon?: React.ReactNode;
  label: React.ReactNode;
  accelerator?: string;
}

interface MenuGroup {
  className?: string;
  classNames?: {
    label?: string;
    icon?: string;
  };
  style?: React.CSSProperties;
  id: string;
  type: MenuType;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuElement[];
}

// ----------------------------------------------------------------------------

interface MenuProps {
  className?: string;
  style?: React.CSSProperties;
  model?: MenuElement[];
  children?: React.ReactNode;
}

export const Menu = (props: MenuProps) => {
  props = util.structureUnion(defaultProps, props);

  console.log(props.model);
  if (props.model) {
    props.model = normalizeMenuElements(props.model);
  }
  if (props.children && !props.model) {
    props.model = createMenuElements(props.children);
  }

  return (
    <div className={props.className} style={props.style}>
      {props.model
        ? props.model.map((element) => {
            console.log(element);
            if (element.type === 'separator') {
              return <Separator></Separator>;
            } else if (element.type === 'item') {
              return <MenuItem item={element as MenuItem}></MenuItem>;
            } else {
              return null;
            }
          })
        : null}
    </div>
  );
};

const defaultProps: MenuProps = {
  className: 'recomp-menu',
};

const MenuItem = ({ item }: { item: MenuItem }) => {
  return (
    <div className={item.className} style={item.style}>
      <div className={item.classNames.icon}>{item.icon}</div>
      <div className={item.classNames.label}>{item.label}</div>
      <div className={item.classNames.accelerator}>{item.accelerator}</div>
    </div>
  );
};

// ----------------------------------------------------------------------------

interface ItemProps {
  className?: string;
  classNames?: {
    icon?: string;
    label?: string;
    accelerator?: string;
  };
  style?: React.CSSProperties;
  id: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  accelerator?: string;
}

const Item = (_props: ItemProps) => {
  return <React.Fragment />;
};
Item.identifier = 'recomp-menu-item';
Menu.Item = Item;

const itemDefaultProps = {
  className: 'item',
  classNames: {
    label: 'label',
    icon: 'icon',
    accelerator: 'accelerator',
  },
};

interface GroupProps {
  className?: string;
  classNames?: {
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  id: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  children?: React.ReactNode;
}

const Group = (_props: GroupProps) => {
  return <React.Fragment />;
};
Group.identifier = 'recomp-menu-group';
Menu.Group = Group;

const groupDefaultProps = {
  className: 'group',
  classNames: {
    label: 'label',
    icon: 'icon',
    accelerator: 'accelerator',
  },
};

interface SeparatorProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const Separator = (props: SeparatorProps) => {
  props = util.structureUnion(separatorDefaultProps, props);
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

const createMenuElements = (children: any): MenuElement[] => {
  const elements: MenuElement[] = [];

  console.log(children);

  React.Children.forEach(children, (child: any) => {
    if (React.isValidElement(child)) {
      const c = child as any;
      if (c && c.type) {
        if (c.type.identifier === Menu.Item.identifier) {
          const item = mapMenuItem(c.props);
          elements.push(item);
          return;
        } else if (c.type.identifier === Menu.Group.identifier) {
          const group = mapMenuGroup(c.props);
          elements.push(group);
          return;
        } else if (c.type.identifier === Menu.Separator) {
          elements.push({ type: 'separator' });
        }
      }
    }

    console.error(
      'Menu child expected to be Menu.Item, Menu.Group or Menu.Separator'
    );
  });

  return elements;
};

const mapMenuItem = (props: ItemProps): MenuItem => {
  props = util.structureUnion(itemDefaultProps, props);
  return {
    id: props.id,
    type: 'item',
    label: props.label,
    icon: props.icon,
    accelerator: props.accelerator,
  };
};

const mapMenuGroup = (props: GroupProps): MenuGroup => {
  props = util.structureUnion(groupDefaultProps, props);
  return {
    id: props.id,
    type: 'group',
    label: props.label,
    icon: props.icon,
    children: createMenuElements(props.children),
  };
};

const normalizeMenuElements = (items: any[]): MenuElement[] => {
  const model: MenuElement[] = [];

  for (const item of items) {
    if (item === 'separator' || item.type === 'separator') {
      model.push({ type: 'separator' });
    } else if (item.children) {
      const props = util.structureUnion(groupDefaultProps, item);
      model.push({
        ...props,
        type: 'group',
        children: normalizeMenuElements(props.children),
      });
    } else {
      const props = util.structureUnion(itemDefaultProps, item);
      model.push({
        ...props,
        type: 'item',
      });
    }
  }

  return model;
};

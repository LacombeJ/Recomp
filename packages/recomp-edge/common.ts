import * as React from 'react';

import * as util from '@recomp/utility/common';

import Edge from './Edge';
import {
  tabDefaultProps,
  groupDefaultProps,
  TabProps,
  GroupProps,
} from './Edge';

/**
 * The tab tree has two properties, "state" which is the structure
 * of the tree and "static" which is variables that are not changed
 * by the sortable interface (classes, styles, nodes, etc).
 */
export interface TabTree {
  state: TreeState;
  static: { [key: string]: TabElement };
}

export interface TreeState {
  byId: { [key: string]: TabNode };
  allIds: string[];
  rootIds: string[];
}

export interface TabNode {
  id: string;
  type: TabItemType;
  expanded: boolean;
  children: string[];
}

interface TabBase {
  className?: string;
  classNames?: {
    dragging?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  type?: TabItemType;
  color?: string;
  icon?: React.ReactNode;
}

export interface TabItem extends TabBase {
  /** Tab item content node */
  children?: React.ReactNode;
}

export interface TabGroup extends TabBase {}

export type TabElement = TabItem | TabGroup;

export type TabItemType = 'item' | 'group';

// ----------------------------------------------------------------------------

const mapTabItem = (props: TabProps): { id: string; item: TabItem } => {
  props = util.structureUnion(tabDefaultProps, props);
  return {
    id: props.id,
    item: {
      className: props.className,
      classNames: props.classNames,
      style: props.style,
      type: 'item',
      icon: props.icon,
      children: props.children,
    },
  };
};

const mapTabGroup = (
  props: GroupProps,
  tree: TabTree
): { id: string; group: TabGroup; expanded: boolean; children: string[] } => {
  props = util.structureUnion(groupDefaultProps, props);
  return {
    id: props.id,
    group: {
      className: props.className,
      classNames: props.classNames,
      style: props.style,
      type: 'group',
      color: props.color,
      icon: props.icon,
    },
    expanded: props.expanded,
    children: mapTabItems(props.children, tree),
  };
};

const mapTabItems = (children: any, tree: TabTree) => {
  const items: string[] = [];

  React.Children.forEach(children, (child: any) => {
    if (React.isValidElement(child)) {
      const c = child as any;
      if (c && c.type) {
        if (c.type.identifier === Edge.Tab.identifier) {
          const item = mapTabItem(c.props);
          tree.static[item.id] = item.item;
          tree.state.allIds.push(item.id);
          tree.state.byId[item.id] = {
            id: item.id,
            type: item.item.type,
            expanded: false,
            children: [],
          };
          items.push(item.id);
          return;
        }
      }
    }

    console.error('Edge.Group child expected to be Edge.Tab');
  });

  return items;
};

export const createTabTree = (children: any): TabTree => {
  const tree: TabTree = {
    state: {
      byId: {},
      allIds: [],
      rootIds: [],
    },
    static: {},
  };

  React.Children.forEach(children, (child: any) => {
    if (React.isValidElement(child)) {
      const c = child as any;
      if (c && c.type) {
        if (c.type.identifier === Edge.Tab.identifier) {
          const item = mapTabItem(c.props);
          tree.static[item.id] = item.item;
          tree.state.allIds.push(item.id);
          tree.state.rootIds.push(item.id);
          tree.state.byId[item.id] = {
            id: item.id,
            type: item.item.type,
            expanded: false,
            children: [],
          };
          return;
        } else if (c.type.identifier === Edge.Group.identifier) {
          const item = mapTabGroup(c.props, tree);
          tree.static[item.id] = item.group;
          tree.state.allIds.push(item.id);
          tree.state.rootIds.push(item.id);
          tree.state.byId[item.id] = {
            id: item.id,
            type: item.group.type,
            expanded: item.expanded,
            children: item.children,
          };
          return;
        }
      }
    }

    console.error('Edge.Tabs child expected to be Edge.Tab or Edge.Group');
  });

  return tree;
};

export const isItem = (element: TabElement): element is TabItem => {
  return element.type === 'item';
};

export const isGroup = (element: TabElement): element is TabGroup => {
  return element.type === 'group';
};

export const elementChildren = (element: TabElement) => {
  if (isItem(element)) {
    return element.children;
  } else {
    return null; // TODO
  }
};

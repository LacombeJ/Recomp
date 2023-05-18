import * as React from 'react';

import * as util from '@recomp/utility/common';

import Edge from './Edge';
import {
  tabDefaultProps,
  groupDefaultProps,
  TabProps,
  GroupProps,
} from './Edge';

interface TabBase {
  className?: string;
  classNames?: {
    dragging?: string;
    icon?: string;
    label?: string;
  };
  style?: React.CSSProperties;
  type?: TabItemType;
  id: string;
  color?: string;
  icon?: React.ReactNode;
}

export interface TabItem extends TabBase {
  children?: React.ReactNode;
}

export interface TabGroup extends TabBase {
  children?: TabItem[];
}

export type TabElement = TabItem | TabGroup;

export type TabItemType = 'item' | 'group';

// ----------------------------------------------------------------------------

const mapTabItem = (props: TabProps): TabItem => {
  props = util.structureUnion(tabDefaultProps, props);
  return {
    id: props.id,
    className: props.className,
    classNames: props.classNames,
    style: props.style,
    type: 'item',
    icon: props.icon,
    children: props.children,
  };
};

const mapTabGroup = (props: GroupProps): TabGroup => {
  props = util.structureUnion(groupDefaultProps, props);
  return {
    id: props.id,
    className: props.className,
    classNames: props.classNames,
    style: props.style,
    type: 'group',
    color: props.color,
    icon: props.icon,
    children: mapTabItems(props.children),
  };
};

const mapTabItems = (children: any) => {
  const items: TabItem[] = [];

  React.Children.forEach(children, (child: any) => {
    if (React.isValidElement(child)) {
      const c = child as any;
      if (c && c.type) {
        if (c.type.identifier === Edge.Tab.identifier) {
          items.push(mapTabItem(c.props));
          return;
        }
      }
    }

    console.error('Edge.Group child expected to be Edge.Tab');
  });

  return items;
};

export const mapTabElements = (children: any) => {
  const mapppedElements: { [key: string]: TabElement } = {};
  const orderedIds: string[] = []; // string of ids

  React.Children.forEach(children, (child: any) => {
    if (React.isValidElement(child)) {
      const c = child as any;
      if (c && c.type) {
        if (c.type.identifier === Edge.Tab.identifier) {
          const item = mapTabItem(c.props);
          mapppedElements[item.id] = item;
          orderedIds.push(item.id);
          return;
        } else if (c.type.identifier === Edge.Group.identifier) {
          const item = mapTabGroup(c.props);
          mapppedElements[item.id] = item;
          orderedIds.push(item.id);
          return;
        }
      }
    }

    console.error('Edge.Tabs child expected to be Edge.Tab or Edge.Group');
  });
  return { mapppedElements, orderedIds };
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

export const elementTabItems = (element: TabElement) => {
  if (!isItem(element)) {
    return element.children;
  } else {
    return null;
  }
};

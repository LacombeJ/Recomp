import * as React from 'react';

import * as util from '@recomp/utility/common';

import { Update, useModel } from '@recomp/hooks';
import { Caret } from '@recomp/icons';

// ----------------------------------------------------------------------------

// Code based on "Edge" component

export interface FolderModel {
  byId: { [id: string]: FolderItem };
  rootIds: string[];
}

export interface FolderItem {
  id: string;
  expanded?: boolean;
  items: string[];
}

export type FolderObject =
  | string
  | {
      id: string;
      expanded?: boolean;
      items: FolderObject[];
    };

// ----------------------------------------------------------------------------

interface FolderProps {
  className?: string;
  classNames?: {
    scrollable?: string;
  };
  style?: React.CSSProperties;
  model?: FolderModel;
  defaultModel?: FolderModel;
  action?: 'item' | 'control';
  renderControl?: (id: string) => React.ReactNode;
  renderItem?: (item: FolderItem) => ItemProps;
  onItemClick?: (id: string) => any;
  onItemDoubleClick?: () => any;
  onUpdateModel?: Update<FolderModel>;
  onEmitUpdate?: (event: FolderModelUpdateEvent) => any;
}

export interface FolderModelUpdateEvent {
  type: 'move' | 'swap' | 'expand';
  active: string;
  moveFrom: null | string;
  moveTo: null | string;
  moveFromIndex: number;
  moveToIndex: number;
  expand: boolean;
}

export const Folder = (props: FolderProps) => {
  props = util.propUnion(defaultProps, props);

  const [model, setModel] = useModel(
    props.defaultModel,
    props.model,
    props.onUpdateModel
  );

  const handleItemToggle = (id: string) => {
    setModel((model) => {
      const item = model.byId[id];
      item.expanded = !item.expanded;
    });
  };

  return (
    <div className={props.className}>
      <div className={props.classNames.scrollable}>
        {model.rootIds.map((id) => {
          const item = model.byId[id];
          const itemProps: ItemProps = util.propUnion(
            itemDefaultProps,
            props.renderItem(item)
          );
          return (
            <FolderItem
              id={id}
              key={id}
              expanded={item.expanded}
              level={0}
              model={model}
              renderItem={props.renderItem}
              onToggle={handleItemToggle}
              {...itemProps}
            ></FolderItem>
          );
        })}
      </div>
    </div>
  );
};

const defaultProps: FolderProps = {
  className: 'recomp-folder',
  classNames: {
    scrollable: 'scrollable',
  },
  renderItem: (item) => {
    let controlIcon = null;
    if (item.items.length > 0) {
      if (item.expanded) {
        controlIcon = <Caret rotation={135}></Caret>;
      } else {
        controlIcon = <Caret rotation={45}></Caret>;
      }
    }
    return {
      children: (
        <div className="line-item">
          <div className="control">{controlIcon}</div>
          <div className="label">{item.id}</div>
        </div>
      ),
    };
  },
  action: 'item',
};

interface ItemProps {
  className?: string;
  classNames?: {
    head?: string;
    body?: string;
    line?: string;
  };
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const itemDefaultProps: ItemProps = {
  className: 'item',
  classNames: {
    head: 'head',
    body: 'body',
    line: 'line',
  },
};

// ----------------------------------------------------------------------------

interface FolderItemProps extends ItemProps {
  id: string;
  expanded: boolean;
  model: FolderModel;
  level: number;
  onToggle?: (id: string) => any;
  renderItem: (item: FolderItem) => ItemProps;
}

const FolderItem = (props: FolderItemProps) => {
  const handleClick = () => {
    props.onToggle(props.id);
  };

  const items = props.model.byId[props.id].items;

  const headStyle: React.CSSProperties = {
    paddingLeft: `${props.level * 10}px`,
  };

  const lineStyle: React.CSSProperties = {
    left: `${props.level * 10 + 4}px`,
  };

  return (
    <div className={props.className} style={props.style}>
      <div className="head" style={headStyle} onClick={handleClick}>
        {props.children}
      </div>
      {props.expanded ? (
        <div className="body">
          {items.map((id) => {
            const item = props.model.byId[id];
            const itemProps: ItemProps = util.propUnion(
              itemDefaultProps,
              props.renderItem(item)
            );
            return (
              <React.Fragment>
                <div className={props.classNames.line} style={lineStyle}></div>
                <FolderItem
                  id={id}
                  key={id}
                  level={props.level + 1}
                  expanded={item.expanded}
                  model={props.model}
                  renderItem={props.renderItem}
                  onToggle={props.onToggle}
                  {...itemProps}
                ></FolderItem>
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

// ----------------------------------------------------------------------------

const createItem = (model: FolderModel, object: FolderObject): FolderItem => {
  if (typeof object === 'string') {
    const item: FolderItem = {
      id: object,
      expanded: false,
      items: [],
    };
    model.byId[item.id] = item;
    return item;
  } else {
    const item: FolderItem = {
      id: object.id,
      expanded: object.expanded,
      items: [],
    };

    model.byId[item.id] = item;
    if (object.items) {
      for (const obj of object.items) {
        const subItem = createItem(model, obj);
        item.items.push(subItem.id);
      }
    }

    return item;
  }
};

export const createModel = (items: FolderObject[]): FolderModel => {
  const model: FolderModel = {
    byId: {},
    rootIds: [],
  };

  for (const obj of items) {
    const item = createItem(model, obj);
    model.rootIds.push(item.id);
  }

  return model;
};

import * as React from 'react';

import * as util from '@recomp/utility/common';

import { Update, useModel, useStateOrProps } from '@recomp/hooks';
import { Caret, File, Folder as FolderIcon } from '@recomp/icons';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

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
  selected?: string;
  model?: FolderModel;
  defaultModel?: FolderModel;
  action?: 'item' | 'control';
  expand?: 'single' | 'double';
  select?: 'head' | 'all';
  moveable?: boolean;
  selectable?: boolean;
  renderControl?: (id: string) => React.ReactNode;
  renderItem?: (item: FolderItem) => ItemProps;
  onSelect?: (id: string) => any;
  onItemClick?: (id: string) => any;
  onItemDoubleClick?: (id: string) => any;
  onItemMove?: (from: string, to: string) => any;
  onUpdateModel?: Update<FolderModel>;
}

export const Folder = (props: FolderProps) => {
  props = util.propUnion(defaultProps, props);

  const [model, setModel] = useModel(
    props.defaultModel,
    props.model,
    props.onUpdateModel
  );

  const [selected, setSelected] = useStateOrProps(
    null,
    props.selected,
    props.onSelect
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const parentMap = React.useMemo(() => {
    return createParentMap(model);
  }, [model]);

  const handleItemClick = (id: string) => {
    props.onItemClick?.(id);
    if (props.selectable) {
      setSelected(id);
    }
    setModel((model) => {
      const item = model.byId[id];
      item.expanded = !item.expanded;
    });
  };

  const handleItemDoubleClick = (id: string) => {
    props.onItemDoubleClick?.(id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active) {
      return;
    }

    const from = active.id as string;
    const to = over ? (over.id as string) : null;

    // Calculate if item can be moved without recursing
    if (!canMoveNonRecursively(parentMap, from, to)) {
      return;
    }

    props.onItemMove?.(from, to);
    setModel((model) => {
      const fromParent = parentMap[from];
      if (fromParent) {
        const parentItem = model.byId[fromParent];
        parentItem.items = parentItem.items.filter((id) => id !== from);
      } else {
        model.rootIds = model.rootIds.filter((id) => id !== from);
      }

      if (to) {
        const parentItem = model.byId[to];
        parentItem.items.push(from);
      } else {
        model.rootIds.push(from);
      }
    });
  };

  return (
    <div className={props.className}>
      <div className={props.classNames.scrollable}>
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
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
                moveable={props.moveable}
                model={model}
                selected={selected}
                select={props.select}
                renderItem={props.renderItem}
                onClick={handleItemClick}
                onDoubleClick={handleItemDoubleClick}
                {...itemProps}
              ></FolderItem>
            );
          })}
        </DndContext>
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
    let fileIcon = <File filled></File>;
    let fileClass = 'file';
    if (item.items.length > 0) {
      fileIcon = <FolderIcon filled></FolderIcon>;
      fileClass = 'folder';
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
          <div className={`icon ${fileClass}`}>{fileIcon}</div>
          <div className={`label ${fileClass}`}>{item.id}</div>
        </div>
      ),
    };
  },
  action: 'item',
  select: 'head',
};

interface ItemProps {
  className?: string;
  classNames?: {
    head?: string;
    body?: string;
    line?: string;
    select?: {
      head?: string;
      all?: string;
    };
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
    select: {
      head: 'selected-head',
      all: 'selected-all',
    },
  },
};

// ----------------------------------------------------------------------------

interface FolderItemProps extends ItemProps {
  id: string;
  expanded: boolean;
  model: FolderModel;
  moveable: boolean;
  selected: string;
  select: 'head' | 'all';
  level: number;
  onClick?: (id: string) => any;
  onDoubleClick?: (id: string) => any;
  renderItem: (item: FolderItem) => ItemProps;
}

const FolderItem = (props: FolderItemProps) => {
  const {
    setNodeRef: droppableRef,
    attributes,
    listeners,
    transform,
  } = useDraggable({ id: props.id });
  const { setNodeRef: draggableRef } = useDroppable({ id: props.id });

  const handleClick = () => {
    props.onClick?.(props.id);
  };

  const handleDoubleClick = () => {
    props.onDoubleClick?.(props.id);
  };

  const handleRef = (element: HTMLDivElement) => {
    if (props.moveable) {
      draggableRef(element);
      droppableRef(element);
    }
  };

  const selected = props.selected === props.id;

  const className = util.classnames({
    [props.className]: true,
    ...(selected
      ? util.selectClassName(props.classNames.select, props.select)
      : {}),
  });

  let droppableProps: any = {};
  if (props.moveable) {
    droppableProps = {
      ...droppableProps,
      ...attributes,
      ...listeners,
    };
  }

  const items = props.model.byId[props.id].items;

  const headStyle: React.CSSProperties = {
    paddingLeft: `${props.level * 10}px`,
    transform: CSS.Transform.toString(transform),
  };

  const lineStyle: React.CSSProperties = {
    left: `${props.level * 10 + 4}px`,
  };

  return (
    <div className={className} style={props.style}>
      <div
        className="head"
        style={headStyle}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        ref={handleRef}
        {...droppableProps}
      >
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
              <React.Fragment key={id}>
                <div className={props.classNames.line} style={lineStyle}></div>
                <FolderItem
                  id={id}
                  level={props.level + 1}
                  expanded={item.expanded}
                  moveable={props.moveable}
                  model={props.model}
                  selected={props.selected}
                  select={props.select}
                  renderItem={props.renderItem}
                  onClick={props.onClick}
                  onDoubleClick={props.onDoubleClick}
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

type ParentMap = { [id: string]: string };

const createParentMap = (model: FolderModel) => {
  const parentMap: ParentMap = {};
  for (const id of model.rootIds) {
    determineParentRecurse(model, parentMap, id, null);
  }
  return parentMap;
};

const determineParentRecurse = (
  model: FolderModel,
  parentMap: ParentMap,
  id: string,
  parent: string
) => {
  if (parentMap[id] !== undefined) return;
  parentMap[id] = parent;

  const item = model.byId[id];
  for (const childId of item.items) {
    determineParentRecurse(model, parentMap, childId, id);
  }
};

const canMoveNonRecursively = (
  parents: ParentMap,
  from: string,
  to: string
) => {
  // Determine this by calculating if self or any ancestor of "to" is equal to "from"
  let covered: { [key: string]: boolean } = {};
  let current = to;
  while (current) {
    if (covered[current]) {
      // structure is already recursive if this occurs
      return false;
    }
    covered[current] = true;

    if (current === from) {
      return false;
    }

    current = parents[current];
  }
  return true;
};

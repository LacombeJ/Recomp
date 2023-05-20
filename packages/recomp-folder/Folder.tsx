import * as React from 'react';

import * as util from '@recomp/utility/common';
import { Collapse, Expand } from '@recomp/icons';
import { Nest } from '@recomp/core';

interface FolderProps {
  className?: string;
  classNames?: {
    nest?: string;
    label?: string;
    icon?: string;
    text?: string;
    edit?: string;
    child?: string;
  };
  style?: React.CSSProperties;
  tree: FolderTree;
  showRoot: boolean;
  rootStatic: boolean;
  showExt: boolean;
  icon: (item: FolderFile) => any;
  controlIcon: (item: FolderFile) => any;
  onItemClick: (event: ClickEvent) => any;
  onItemDoubleClick: (event: ClickEvent) => any;
  onEditCancel: (event: EditEvent) => any;
  onEditSubmit: (event: EditEvent) => any;
  children?: React.ReactNode;
}

const FolderContext: React.Context<FolderContextState> =
  React.createContext(null);

const Folder = (props: FolderProps) => {
  props = util.structureUnion(defaultProps, props);

  const { className, classNames, style } = props;

  const {
    tree,
    showRoot,
    rootStatic,
    showExt,
    icon,
    controlIcon,
    onItemClick,
    onItemDoubleClick,
    onEditCancel,
    onEditSubmit,
  } = props;

  if (tree.paths.allIds.length === 0 || tree.paths.rootId === null) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <FolderContext.Provider
      value={{
        tree,
        classNames,
        showRoot,
        rootStatic,
        showExt,
        icon,
        controlIcon,
        onItemClick,
        onItemDoubleClick,
        onEditCancel,
        onEditSubmit,
      }}
    >
      <div className={className} style={style}>
        <Branch id={tree.paths.rootId} level={0}></Branch>
      </div>
    </FolderContext.Provider>
  );
};

// ----------------------------------------------------------------------------

const defaultIconCallback = (): any => {
  return null;
};

const defaultControlIconCallback = (item: FolderFile) => {
  if (item.isDirectory) {
    if (item.collapsed) {
      return <Expand></Expand>;
    } else {
      return <Collapse></Collapse>;
    }
  }
  return null;
};

const defaultProps: FolderProps = {
  className: 'recomp-folder',
  classNames: {
    nest: 'nest',
    label: 'label',
    icon: 'icon',
    text: 'text',
    edit: 'edit',
    child: 'child',
  },
  tree: undefined,
  showRoot: true,
  rootStatic: true,
  showExt: true,
  icon: defaultIconCallback,
  controlIcon: defaultControlIconCallback,
  onItemClick: () => {},
  onItemDoubleClick: () => {},
  onEditCancel: () => {},
  onEditSubmit: () => {},
};

// ----------------------------------------------------------------------------

interface FolderContextState {
  classNames: {
    nest?: string;
    label?: string;
    icon?: string;
    text?: string;
    edit?: string;
    child?: string;
  };
  tree: FolderTree;
  showRoot: boolean;
  rootStatic: boolean;
  showExt: boolean;
  icon: (item: IconInfo) => any;
  controlIcon: (item: IconInfo) => any;
  onItemClick: (event: ClickEvent) => any;
  onItemDoubleClick: (event: ClickEvent) => any;
  onEditCancel: (event: EditEvent) => any;
  onEditSubmit: (event: EditEvent) => any;
}

interface FolderFile {
  id: string;
  basename: string;
  ext: string;
  filepath: string;
  isDirectory: boolean;
  collapsed: boolean;
  children: string[];
}

interface FolderTree {
  paths: {
    byId: { [key: string]: FolderFile };
    allIds: string[];
    rootId: string;
  };
  selected: string[];
  editing: {
    id: string;
    type: EditingType;
    text: string;
    selection: SelectionRange;
  };
}

interface ClickEvent {
  event: React.MouseEvent;
  branch: FolderFile;
}

// { branch, text: e.target.value, type }
interface EditEvent {
  branch: FolderFile;
  text: string;
  type: EditingType;
}

type EditingType = 'rename' | 'create-file' | 'create-folder';

type SelectionRange = {
  start: number;
  end: number;
};

type IconInfo = {
  isDirectory: boolean;
  collapsed: boolean;
};

// ----------------------------------------------------------------------------

interface BranchProps {
  id: string;
  level: number;
}

const Branch = (props: BranchProps) => {
  const { id, level } = props;

  const context = React.useContext(FolderContext);

  const path = context.tree.paths.byId[id];
  if (!path) return null;

  let collapsed = path.collapsed;
  if (context.rootStatic && level === 0) {
    collapsed = false;
  }

  return (
    <Nest key={id} id={id} collapsed={collapsed}>
      <Element
        id={id}
        level={level}
        path={path}
        collapsed={collapsed}
      ></Element>
      <Child id={id} level={level} path={path}></Child>
    </Nest>
  );
};

// ----------------------------------------------------------------------------

interface ElementProps {
  id: string;
  level: number;
  path: FolderFile;
  collapsed: boolean;
}

const Element = (props: ElementProps) => {
  const { id, level, path, collapsed } = props;

  const context = React.useContext(FolderContext);

  if (!context.showRoot && level === 0) return null;

  const item = { id, isDirectory: path.isDirectory, collapsed };

  const className = util.classnames({
    [context.classNames.nest]: true,
    directory: path.isDirectory,
    nochild: path.children.length === 0,
    selected: context.tree.selected.includes(id),
  });

  let padding = level * 10;
  if (!path.isDirectory) {
    padding += 20;
  }

  const handleItemClick = (e: React.MouseEvent) => {
    context.onItemClick({
      event: e,
      branch: { ...path },
    });
  };

  const handleItemDoubleClick = (e: React.MouseEvent) => {
    context.onItemDoubleClick({
      event: e,
      branch: { ...path },
    });
  };

  const style = {
    paddingLeft: `${padding + (context.showRoot ? 10 : 0)}px`,
    display: 'flex',
  };

  const basename = context.showExt ? path.basename + path.ext : path.basename;
  let editElement = <span className={context.classNames.text}>{basename}</span>;
  if (
    context.tree.editing.id === id &&
    context.tree.editing.type === 'rename'
  ) {
    editElement = (
      <Edit
        branch={{ ...path }}
        type={context.tree.editing.type}
        className={context.classNames.edit}
        defaultValue={context.tree.editing.text}
        defaultSelection={context.tree.editing.selection}
        onEditCancel={context.onEditCancel}
        onEditSubmit={context.onEditSubmit}
      ></Edit>
    );
  }

  return (
    <div
      className={className}
      onMouseUp={handleItemClick}
      onDoubleClick={handleItemDoubleClick}
    >
      <div style={style}>
        {context.controlIcon(item)}
        <span className={context.classNames.label}>
          <span className={context.classNames.icon}>{context.icon(item)}</span>
          {editElement}
        </span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------

interface PseudoElementProps {
  id: string;
  level: number;
  path: FolderFile;
  isDirectory: boolean;
}

const PseudoElement = (props: PseudoElementProps) => {
  const { id, level, path, isDirectory } = props;

  const context = React.useContext(FolderContext);

  const item = { isDirectory, collapsed: true };

  const className = util.classnames({
    [context.classNames.nest]: true,
    directory: isDirectory,
    nochild: true,
    selected: true,
  });

  let padding = level * 10;
  if (!isDirectory) {
    padding += 20;
  }

  const style = {
    paddingLeft: `${padding}px`,
    display: 'flex',
  };

  let editElement = null;
  if (
    context.tree.editing.id === id &&
    (context.tree.editing.type === 'create-folder' ||
      context.tree.editing.type === 'create-file')
  ) {
    editElement = (
      <Edit
        branch={{ ...path }}
        type={context.tree.editing.type}
        className={context.classNames.edit}
        defaultValue={context.tree.editing.text}
        defaultSelection={context.tree.editing.selection}
        onEditCancel={context.onEditCancel}
        onEditSubmit={context.onEditSubmit}
      ></Edit>
    );
  } else {
    return null;
  }

  return (
    <div className={className}>
      <div style={style}>
        {context.controlIcon(item)}
        <span className={context.classNames.label}>
          <span className={context.classNames.icon}>{context.icon(item)}</span>
          {editElement}
        </span>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------------

interface ChildProps {
  id: string;
  level: number;
  path: FolderFile;
}

const Child = (props: ChildProps) => {
  const { id, level, path } = props;

  const context = React.useContext(FolderContext);

  return (
    <div className={context.classNames.child}>
      <PseudoElement
        id={id}
        level={level + 1}
        path={path}
        isDirectory={context.tree.editing.type === 'create-folder'}
      ></PseudoElement>
      {path.children.map((childId) => {
        return <Branch key={childId} id={childId} level={level + 1}></Branch>;
      })}
    </div>
  );
};

// ----------------------------------------------------------------------------

interface EditProps {
  className: string;
  branch: FolderFile;
  type: EditingType;
  defaultValue: string;
  defaultSelection: { start: number; end: number };
  onEditCancel: (event: EditEvent) => any;
  onEditSubmit: (event: EditEvent) => any;
}

const Edit = (props: EditProps) => {
  const { className, branch, type, defaultValue, defaultSelection } = props;

  const ref = React.useRef(null);

  const setRef = (element: HTMLInputElement) => {
    ref.current = element;
    if (ref.current) {
      ref.current.focus();
      if (defaultSelection) {
        ref.current.setSelectionRange(
          defaultSelection.start,
          defaultSelection.end
        );
      }
    }
  };

  const handleEditBlur = (e: React.FocusEvent) => {
    const element = e.target as HTMLInputElement;
    props.onEditCancel({ branch, text: element.value, type });
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    const element = e.target as HTMLInputElement;
    if (e.key === 'Escape') {
      props.onEditCancel({ branch, text: element.value, type });
    } else if (e.key === 'Enter') {
      props.onEditSubmit({ branch, text: element.value, type });
    }
  };

  return (
    <input
      className={className}
      type="text"
      defaultValue={defaultValue}
      spellCheck={false}
      onBlur={handleEditBlur}
      onKeyDown={handleEditKeyDown}
      ref={setRef}
    ></input>
  );
};

// ----------------------------------------------------------------------------

interface ShellProps {
  className?: string;
  style?: React.CSSProperties,
  children?: React.ReactNode;
};

const Shell = (props: ShellProps) => {
  props = util.structureUnion(shellDefaultProps, props);
  const { className, style } = props;

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};

const shellDefaultProps = {
  className: 'recomp-folder-shell',
};
Folder.Shell = Shell;

export default Folder;

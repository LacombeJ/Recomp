import React from 'react';

import { Folder } from '@recomp/folder';
import './stories.styl';

export default {
  title: 'Components/Folder',
  component: Folder,
  argTypes: {},
};

const Template = (args) => <Folder {...args} />;

const ShellTemplate = (args) => (
  <Folder.Shell>
    <Folder {...args} />
  </Folder.Shell>
);

const exampleTreeBuilder = {
  workspace: [
    { '.git': [] },
    { node_modules: [] },
    { src: [{ 'index.js': [] }] },
    { test: [{ 'spec.js': [] }] },
    { 'package.json': [] },
  ],
};

const buildTree = (builder) => {
  const exampleTree = {
    paths: {
      byId: {},
      allIds: [],
      rootId: null,
    },
    selected: [],
    editing: {
      id: '',
      type: '',
      text: '',
      selection: {},
    },
  };

  const root = buildTreeRecurse(exampleTree, builder);
  exampleTree.paths.rootId = root;
  console.log(root);
  console.log(exampleTree);
  return exampleTree;
};

const buildTreeRecurse = (tree, current) => {
  const name = Object.keys(current)[0];

  const children = current[name];
  // console.log(children);
  const item = {
    id: name,
    basename: name,
    ext: '.txt',
    filepath: name,
    isDirectory: children.length !== 0,
    collapsed: true,
    children: [],
  };
  tree.paths.byId[name] = item;
  tree.paths.allIds.push(name);

  for (const child of children) {
    const childName = buildTreeRecurse(tree, child);
    item.children.push(childName);
  }

  return name;
};

const exampleTree = buildTree(exampleTreeBuilder);

export const Basic = Template.bind({});
Basic.args = {
  tree: exampleTree,
};

export const Shell = ShellTemplate.bind({});
Shell.args = {
  tree: exampleTree,
};

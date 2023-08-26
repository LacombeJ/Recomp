import React from 'react';

import { File, Folder as FolderIcon, Caret } from '@recomp/icons';
import { Folder, createModel, useFolderState } from '@recomp/folder';
import '../stories.scss';

export default {
  title: 'Components/Folder',
  component: Folder,
  argTypes: {},
};

const Template = (args) => {
  const { defaultModel, ...restArgs } = args;
  const folder = useFolderState(defaultModel);
  return (
    <div className="folder-wrapper">
      <Folder {...restArgs} {...folder.props} />
    </div>
  );
};

const edgeModel = [
  {
    id: '.git',
    items: ['index'],
  },
  {
    id: 'node_modules',
    items: ['.cache'],
  },
  {
    id: 'src',
    items: [
      {
        id: 'app',
        items: ['App.tsx', 'App.scss'],
      },
      'index.ts',
      'index.html',
    ],
  },
  'package.json',
  'README.md',
];

export const Basic = Template.bind({});
Basic.args = {
  defaultModel: createModel(edgeModel),
};

const edgeModelDocuments = [
  {
    id: 'Food',
    items: ['Recipes', 'Restaurants'],
  },
  {
    id: 'Journal',
    items: [
      {
        id: 'January',
        items: ['January 1st', 'January 2nd'],
      },
      'Log',
    ],
  },
  {
    id: 'Music',
    items: ['Artists', 'Songs'],
  },
  {
    id: 'Travel',
    items: ['Destinations', 'Gallery'],
  },
  'Notes',
];

export const Moveable = Template.bind({});
Moveable.args = {
  defaultModel: createModel(edgeModelDocuments),
  moveable: true,
  renderItem: (item) => {
    let fileIcon = <File></File>;
    if (item.items.length > 0) {
      fileIcon = <File filled></File>;
    }
    return {
      children: (
        <div className="line-item">
          <div className={`icon file`}>{fileIcon}</div>
          <div className={`label file`}>{item.id}</div>
        </div>
      ),
    };
  },
};

export const Selectable = Template.bind({});
Selectable.args = {
  selectable: true,
  defaultModel: createModel(edgeModel),
};

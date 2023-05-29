import React from 'react';

import { Folder, createModel } from '@recomp/folder';
import '../stories.scss';

export default {
  title: 'Components/Folder',
  component: Folder,
  argTypes: {},
};

const Template = (args) => (
  <div className="folder-wrapper">
    <Folder {...args} />
  </div>
);

const edgeModel = [
  {
    id: '.git',
    items: [],
  },
  {
    id: 'node_modules',
    items: [],
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

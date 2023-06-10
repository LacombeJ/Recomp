import React from 'react';

import { Edge, createModel } from '@recomp/edge';
import '../stories.scss';
import '../stories.scss';

export default {
  title: 'Components/Edge',
  component: Edge,
  argTypes: {},
};

const Template = (args) => <Edge {...args} />;

const edgeRenderMap = {
  Components: {
    color: '#CA5D49',
  },
  Styles: {
    color: '#31AC9F',
  },
};

const renderGroup = (id) => {
  const props = edgeRenderMap[id];
  return { ...props, children: id };
};

const edgeModel = [
  {
    id: 'Components',
    items: ['Button.tsx', 'List.tsx', 'Navbar.tsx'],
  },
  {
    id: 'Styles',
    items: ['button.scss', 'list.scss', 'navbar.scss'],
  },
  'index.ts',
  'index.html',
  'package.json',
  'tsconfig.json',
  'README.md',
];

export const Basic = Template.bind({});
Basic.args = {
  defaultModel: createModel(edgeModel),
  onRenderGroup: renderGroup,
};

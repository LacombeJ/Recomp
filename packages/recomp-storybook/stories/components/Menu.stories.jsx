import React from 'react';

import { Menu } from '@recomp/menu';
import '../stories.scss';

export default {
  title: 'Components/Menu',
  component: Menu,
  argTypes: {},
};

const Template = (args) => <Menu {...args} />;

const menuModel = [
  { id: 'openfile', label: 'Open File' },
  { id: 'reveal', label: 'Reveal In System Explorer' },
  { type: 'separator' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { type: 'separator' },
  { id: 'rename', label: 'Rename' },
  { id: 'delete', label: 'Delete' },
];

export const Basic = Template.bind({});
Basic.args = {
  model: menuModel,
};

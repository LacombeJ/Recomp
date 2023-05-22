import React from 'react';

import { Menu } from '@recomp/menu';
import '../stories.scss';

export default {
  title: 'Components/Menu',
  component: Menu,
  argTypes: {},
};

const Template = (args) => (
  
    <Menu {...args} />
  
);

const menuModel = [
  {
    id: 'newfile',
    label: 'New File',
    children: [
      { id: 'newfile.document', label: 'Document', accelerator: 'Ctrl+N' },
      { id: 'newfile.spreadsheet', label: 'Spreadsheet' },
      { id: 'newfile.slides', label: 'Slides' },
    ],
  },
  { id: 'createdocument', label: 'Create Document', accelerator: 'Ctrl+N' },
  { type: 'separator' },
  { id: 'copy', label: 'Copy', accelerator: 'Ctrl+C' },
  { id: 'paste', label: 'Paste', accelerator: 'Ctrl+V' },
  { type: 'separator' },
  { id: 'shortcuts', label: 'Shortcuts', accelerator: 'Ctrl+K' },
  {
    id: 'preferences',
    label: 'Preferences',
    children: [
      {
        id: 'preferences.shortcuts',
        label: 'Shortcuts',
      },
      {
        id: 'preferences.theme',
        label: 'Theme',
        children: [
          { id: 'theme.color', label: 'Color Theme' },
          { id: 'theme.icon', label: 'Icon Theme' },
        ],
      },
    ],
  },
  {
    id: 'long',
    label: 'Long List',
    children: [
      { id: 'item.0', label: 'Document' },
      { id: 'item.1', label: 'Document' },
      { id: 'item.2', label: 'Document' },
      { id: 'item.3', label: 'Document' },
      { id: 'item.4', label: 'Document' },
      { id: 'item.5', label: 'Document' },
      { id: 'item.6', label: 'Document' },
      { id: 'item.7', label: 'Document' },
      { id: 'item.8', label: 'Document' },
      { id: 'item.9', label: 'Document' },
      { id: 'item.10', label: 'Document' },
      { id: 'item.11', label: 'Document' },
      { id: 'item.12', label: 'Document' },
      { id: 'item.13', label: 'Document' },
      { id: 'item.14', label: 'Document' },
    ],
  },
];

export const Basic = Template.bind({});
Basic.args = {
  model: menuModel,
};

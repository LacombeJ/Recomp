import React from 'react';

import { TitleBar } from '@recomp/titlebar';
import '../stories.scss';

import { IconLayoutNavbar } from '@tabler/icons-react';

export default {
  title: 'Components/TitleBar',
  component: TitleBar,
  argTypes: {},
};

const Template = (args) => (
  <div class="titlebar-container">
    <TitleBar {...args} />
  </div>
);

const menuModel = [
  {
    id: 'file',
    label: 'File',
    children: [
      {
        id: 'file.new',
        label: 'New File',
        children: [
          { id: 'file.new.document', label: 'Document', accelerator: 'Ctrl+N' },
          { id: 'file.new.spreadsheet', label: 'Spreadsheet' },
          { id: 'file.new.slides', label: 'Slides' },
        ],
      },
      {
        id: 'file.createdocument',
        label: 'Create Document',
        accelerator: 'Ctrl+N',
      },
      { type: 'separator' },
      { id: 'file.open', label: 'Open...', accelerator: 'Ctrl+O' },
      { id: 'file.save', label: 'Save', accelerator: 'Ctrl+S' },
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
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    children: [
      {
        id: 'edit.undo',
        label: 'Undo',
        accelerator: 'Ctrl+Z',
      },
      {
        id: 'edit.redo',
        label: 'Redo',
        accelerator: 'Ctrl+Y',
      },
      { type: 'separator' },
      {
        id: 'edit.cut',
        label: 'Cut',
        accelerator: 'Ctrl+X',
      },
      {
        id: 'edit.copy',
        label: 'Copy',
        accelerator: 'Ctrl+C',
      },
      {
        id: 'edit.paste',
        label: 'Pate',
        accelerator: 'Ctrl+V',
      },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    children: [
      {
        id: 'help.commands',
        label: 'Show Commands',
      },
      {
        id: 'help.about',
        label: 'About',
      },
    ],
  },
];

export const Basic = Template.bind({});
Basic.args = {
  children: [
    <TitleBar.Icon key="icon">
      <IconLayoutNavbar size="20" stroke="1"></IconLayoutNavbar>
    </TitleBar.Icon>,
    <TitleBar.MenuBar key="menu" model={menuModel}></TitleBar.MenuBar>,
    <TitleBar.Header key="header">TitleBar</TitleBar.Header>,
    <TitleBar.ControlBar key="controlbar">
      <TitleBar.ControlButton type="minimize"></TitleBar.ControlButton>
      <TitleBar.ControlButton type="maximize"></TitleBar.ControlButton>
      <TitleBar.ControlButton type="close"></TitleBar.ControlButton>
    </TitleBar.ControlBar>,
  ],
};

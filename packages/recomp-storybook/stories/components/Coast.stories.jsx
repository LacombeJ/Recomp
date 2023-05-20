import React from 'react';

import {
  IconFolder,
  IconSearch,
  IconApps,
  IconChecklist,
  IconUser,
  IconSettings,
  IconPuzzle,
} from '@tabler/icons-react';

import { Coast } from '@recomp/coast';
import '../stories.styl';

export default {
  title: 'Components/Coast',
  component: Coast,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

const coastItems = [
  <Coast.Tabs key="tabs">
    <Coast.Tab id="explorer" tooltip="Explorer (Ctrl+Shift+E)">
      <IconFolder size="26" stroke="1"></IconFolder>
    </Coast.Tab>
    <Coast.Tab id="search" tooltip="Search (Ctrl+Shift+F)">
      <IconSearch size="26" stroke="1"></IconSearch>
    </Coast.Tab>
    <Coast.Tab id="apps" tooltip="Apps (Ctrl+Shift+A)">
      <IconApps size="26" stroke="1"></IconApps>
    </Coast.Tab>
    <Coast.Tab id="extensions" tooltip="Extensions">
      <IconPuzzle size="26" stroke="1"></IconPuzzle>
    </Coast.Tab>
    <Coast.Tab id="tasks" tooltip="Tasks">
      <IconChecklist size="26" stroke="1"></IconChecklist>
    </Coast.Tab>
  </Coast.Tabs>,
  <Coast.Spacer key="spacer"></Coast.Spacer>,
  <Coast.Controls key="controls">
    <Coast.Control id="account" tooltip="Account">
      <IconUser size="26" stroke="1"></IconUser>
    </Coast.Control>
    <Coast.Control id="settings" tooltip="Settings">
      <IconSettings size="26" stroke="1"></IconSettings>
    </Coast.Control>
  </Coast.Controls>,
];

const Template = (args) => <Coast {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: coastItems,
};

export const Right = Template.bind({});
Right.args = {
  position: 'right',
  children: coastItems,
};

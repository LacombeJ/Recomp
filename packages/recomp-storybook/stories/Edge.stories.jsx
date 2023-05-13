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

import { Edge } from '@recomp/edge';
import './stories.styl';

export default {
  title: 'Components/Edge',
  component: Edge,
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

const edgeItems = [
  <Edge.Tabs key="tabs">
    <Edge.Tab id="explorer" tooltip="Explorer (Ctrl+Shift+E)">
      <IconFolder size="26" stroke="1"></IconFolder>
    </Edge.Tab>
    <Edge.Tab id="search" tooltip="Search (Ctrl+Shift+F)">
      <IconSearch size="26" stroke="1"></IconSearch>
    </Edge.Tab>
    <Edge.Tab id="apps" tooltip="Apps (Ctrl+Shift+A)">
      <IconApps size="26" stroke="1"></IconApps>
    </Edge.Tab>
    <Edge.Tab id="plugins" tooltip="Plugins">
      <IconPuzzle size="26" stroke="1"></IconPuzzle>
    </Edge.Tab>
    <Edge.Tab id="tasks" tooltip="Tasks">
      <IconChecklist size="26" stroke="1"></IconChecklist>
    </Edge.Tab>
  </Edge.Tabs>,
  <Edge.Spacer key="spacer"></Edge.Spacer>,
  <Edge.Controls key="controls">
    <Edge.Control id="account" tooltip="Account">
      <IconUser size="26" stroke="1"></IconUser>
    </Edge.Control>
    <Edge.Control id="settings" tooltip="Settings">
      <IconSettings size="26" stroke="1"></IconSettings>
    </Edge.Control>
  </Edge.Controls>,
];

const Template = (args) => <Edge {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: edgeItems,
};

export const Right = Template.bind({});
Right.args = {
  position: 'right',
  children: edgeItems,
};

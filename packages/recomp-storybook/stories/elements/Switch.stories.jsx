import React from 'react';

import { Switch } from '@recomp/core';
import '../stories.styl';

export default {
  title: 'Elements/Switch',
  component: Switch,
  argTypes: {},
};

const Template = (args) => <Switch {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Switch',
};

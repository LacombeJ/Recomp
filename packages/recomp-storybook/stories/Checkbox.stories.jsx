import React from 'react';

import { Checkbox } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Example/Checkbox',
  component: Checkbox,
  argTypes: {},
};

const Template = (args) => <Checkbox {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Checkbox',
};

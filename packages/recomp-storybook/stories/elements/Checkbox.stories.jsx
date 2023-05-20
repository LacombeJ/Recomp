import React from 'react';

import { Checkbox } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Checkbox',
  component: Checkbox,
  argTypes: {},
};

const Template = (args) => <Checkbox {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Checkbox',
};

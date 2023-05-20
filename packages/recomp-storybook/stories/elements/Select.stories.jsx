import React from 'react';

import { Select } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Select',
  component: Select,
  argTypes: {},
};

const Template = (args) => <Select {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  options: ['First Option', 'Second Option', 'Third Option'],
};

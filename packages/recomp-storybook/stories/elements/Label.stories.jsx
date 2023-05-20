import React from 'react';

import { Label } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Label',
  component: Label,
  argTypes: {},
};

const Template = (args) => <Label {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Label',
};

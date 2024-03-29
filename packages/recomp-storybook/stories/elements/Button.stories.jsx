import React from 'react';

import { Button } from '@recomp/core';
import '../stories.scss';

export default {
  title: 'Elements/Button',
  component: Button,
  argTypes: {},
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  variant: 'default',
  children: 'Button',
};

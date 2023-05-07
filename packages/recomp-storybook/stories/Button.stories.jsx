import React from 'react';

import { Button } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {},
};

const Template = (args) => <Button {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Button',
};

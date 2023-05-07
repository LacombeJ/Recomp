import React from 'react';

import { Input } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Example/Input',
  component: Input,
  argTypes: {},
};

const Template = (args) => <Input {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  defaultValue: 'Input',
};

import React from 'react';

import { Quote } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Elements/Quote',
  component: Quote,
  argTypes: {},
};

const Template = (args) => <Quote {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: "Don't quote me",
  by: 'Quotable Guy',
};

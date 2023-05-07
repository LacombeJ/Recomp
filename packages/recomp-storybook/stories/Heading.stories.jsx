import React from 'react';

import { Heading } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Example/Heading',
  component: Heading,
  argTypes: {},
};

const Template = (args) => <Heading {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Heading',
};

import React from 'react';

import { Text } from '@recomp/core';
import './stories.styl';

export default {
  title: 'Example/Text',
  component: Text,
  argTypes: {},
};

const Template = (args) => <Text {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Text',
};

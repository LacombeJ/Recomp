import React from 'react';

import { Text } from '@recomp/core';
import '../stories.styl';

export default {
  title: 'Elements/Text',
  component: Text,
  argTypes: {},
};

const Template = (args) => <Text {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  children: 'Text',
};
